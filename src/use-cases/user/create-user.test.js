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
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
        const createUserRepositoryStub = new CreateUserRepositoryStub()
        const passwordHasherAdapterStub = new PasswordHasherAdapterStub()
        const idGeneratorAdapterStub = new IdGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepositoryStub,
            createUserRepositoryStub,
            passwordHasherAdapterStub,
            idGeneratorAdapterStub,
        )

        return {
            sut,
            getUserByEmailRepositoryStub,
            createUserRepositoryStub,
            passwordHasherAdapterStub,
            idGeneratorAdapterStub,
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
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        // Arrange
        jest.spyOn(getUserByEmailRepositoryStub, 'execute').mockResolvedValue(
            user,
        )

        // Act
        const promise = sut.execute(user)

        // Assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })
})
