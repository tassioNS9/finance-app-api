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

    it('should call DeleteUserRepository with correct params', async () => {
        // arrange
        const { sut, deleteUserRepository } = makeSut()
        const deleteUserRepositorySpy = jest.spyOn(
            deleteUserRepository,
            'execute',
        )
        const userId = faker.datatype.uuid()

        // act
        await sut.execute(userId)

        // assert
        expect(deleteUserRepositorySpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if DeleteUserRepository throws', async () => {
        // arrange
        const { sut, deleteUserRepository } = makeSut()
        const deleteUserRepositorySpy = jest.spyOn(
            deleteUserRepository,
            'execute',
        )

        deleteUserRepositorySpy.mockRejectedValueOnce(new Error())

        // act
        const userId = faker.datatype.uuid()
        const promise = sut.execute(userId)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
