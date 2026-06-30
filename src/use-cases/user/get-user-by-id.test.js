import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id'
import { user } from '../../tests/fixtures/user.js'

describe('GetUserByIdUseCase', () => {
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepository)
        return { sut, getUserByIdRepository }
    }

    it('should get user by id successfully', async () => {
        // arrange
        const { sut } = makeSut()
        const userId = faker.datatype.uuid()
        // act
        const result = await sut.execute(userId)
        // assert
        expect(result).toEqual(user)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        const userId = faker.datatype.uuid()
        getUserByIdRepositorySpy.mockResolvedValue(user)
        // act
        await sut.execute(userId)
        // assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        getUserByIdRepositorySpy.mockRejectedValue(new Error())
        // act
        const promise = sut.execute(faker.datatype.uuid())
        //assert
        await expect(promise).rejects.toThrow()
    })
})
