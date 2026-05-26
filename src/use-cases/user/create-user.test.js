import { EmailAlreadyInUseError } from '../../errors/user'
import { CreateUserUseCase } from './create-user'
import { faker } from '@faker-js/faker'
describe('Create User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null // Simulate that no user exists with the given email
        }
    }

    class CreateUserRepositoryStub {
        async execute(userData) {
            return userData // Simulate successful user creation
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password' // Simulate password hashing
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'unique_id' // Simulate unique ID generation
        }
    }
    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }
    const user = {
        first_name: faker.name.fullName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 8,
        }),
    }
    it('should create a new user successfully', async () => {
        const { sut } = makeSut()
        // Arrange
        const createdUser = await sut.execute(user)

        // Assert
        expect(createdUser).toBeTruthy()
    })

    it('should throw an EmailAlreadyExistsError if GetUserByEmailRepository returns a user', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        // Arrange
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(user)

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call IdGeneratorAdapter to generate a random id ', async () => {
        const { sut, idGeneratorAdapter, createUserRepository } = makeSut()
        // Arrange
        const executeSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        const createUserRepositoryExecuteSpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        // Act
        await sut.execute(user)

        // Assert
        expect(executeSpy).toHaveBeenCalled()
        expect(createUserRepositoryExecuteSpy).toHaveBeenCalledWith({
            ...user,
            id: 'unique_id',
            password: 'hashed_password',
        })
    })

    it('should call PasswordHasherAdapter to generate a cryptograph password', async () => {
        const {
            sut,

            passwordHasherAdapter,
            createUserRepository,
        } = makeSut()
        // Arrange
        const passwordHasherExecuteSpy = jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )
        const createUserRepositoryExecuteSpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        // Act
        await sut.execute(user)

        // Assert
        expect(passwordHasherExecuteSpy).toHaveBeenCalledWith(user.password)
        expect(createUserRepositoryExecuteSpy).toHaveBeenCalledWith({
            ...user,
            id: 'unique_id',
            password: 'hashed_password',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        // Arrange
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        // Arrange
        // Como o IdGeneratorAdapter é síncrono, usamos mockImplementation para simular um erro
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementation(() => {
            throw new Error()
        })

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        // Arrange
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValue(
            new Error(),
        )

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if CreateUserRepository throws', async () => {
        const { sut, createUserRepository } = makeSut()
        // Arrange
        jest.spyOn(createUserRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow()
    })
})
