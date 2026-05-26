import { DeleteUserUseCase } from './delete-user'
import { faker } from '@faker-js/faker'

describe('DeleteUserUseCase', () => {
    const user = {
        id: faker.datatype.uuid(),
        first_name: faker.name.fullName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 8,
        }),
    }
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepository)
        return { sut, deleteUserRepository }
    }

    it('should delete a user successfully', async () => {
        // arrange
        const { sut } = makeSut()
        // Arrange
        const deletedUser = await sut.execute(faker.datatype.uuid())

        // Assert
        expect(deletedUser).toEqual(user)
    })
})
