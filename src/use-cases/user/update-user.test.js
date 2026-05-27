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
})
