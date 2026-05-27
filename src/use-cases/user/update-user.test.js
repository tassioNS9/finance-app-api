import { EmailAlreadyInUseError } from '../../errors/user'
import { UpdateUserUseCase } from './update-user'
import { faker } from '@faker-js/faker'

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.datatype.uuid(),
        first_name: faker.name.fullName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 8,
        }),
    }
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null // Simulate that no user exists with the given email
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user // Simulate successful user update
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password' // Simulate password hashing
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const updateUserRepository = new UpdateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()

        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        }
    }
    it('should update user successfully (without email and password)', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(faker.datatype.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })
        // Assert
        expect(result).toBe(user)
    })

    it('should update user successfully (with email)', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut()
        const getUserByEmailSpy = jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )
        const newEmail = faker.internet.email()

        // Act
        const result = await sut.execute(faker.datatype.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: newEmail,
        })
        // Assert
        expect(getUserByEmailSpy).toHaveBeenCalledWith(newEmail)
        expect(result).toBe(user)
    })

    it('should update user successfully (with password)', async () => {
        // Arrange
        const { sut, passwordHasherAdapter } = makeSut()
        const newPassword = faker.internet.password({
            length: 10,
        })
        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute')

        // Act
        const result = await sut.execute(faker.datatype.uuid(), {
            password: newPassword,
        })
        // Assert
        expect(passwordHasherSpy).toHaveBeenCalledWith(newPassword)
        expect(result).toBe(user)
    })

    it('should throw EmailAlreadyInUseError if email is already in use by another user', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut()
        // Simulate that a user with the provided email already exists
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(user)

        // Act & Assert
        const promise = sut.execute(faker.datatype.uuid(), {
            email: user.email,
        })
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call updateUserRepository with correct params', async () => {
        // Arrange
        const { sut, updateUserRepository } = makeSut()
        const updateUserSpy = jest.spyOn(updateUserRepository, 'execute')
        const updateUserParams = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        }

        // Act
        await sut.execute(user.id, updateUserParams)

        // Assert
        expect(updateUserSpy).toHaveBeenCalledWith(user.id, {
            ...updateUserParams,
            password: 'hashed_password', // Password should be hashed
        })
    })

    it('should throw if updateUserRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        // Arrange
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        // Act
        const promise = sut.execute(faker.datatype.uuid(), {
            email: user.email,
        })

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
