import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance'
import { UserNotFoundError } from '../../errors/user.js'
describe('getUserBalanceUseCase', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return faker.datatype.number()
        }
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.datatype.uuid(),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
            }
        }
    }
    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )
        return { sut, getUserBalanceRepository, getUserByIdRepository }
    }

    it('should get user balance successfully', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const balance = await sut.execute()
        // assert

        expect(balance).toBeTruthy()
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        getUserByIdRepositorySpy.mockResolvedValue(null)
        const userId = faker.datatype.uuid()

        // act
        const promise = sut.execute(userId)
        // assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        // arrange
        const { sut, getUserBalanceRepository } = makeSut()
        const getUserBalanceRepositorySpy = jest.spyOn(
            getUserBalanceRepository,
            'execute',
        )
        const userId = faker.datatype.uuid()
        const from = faker.date.past()
        const to = faker.date.recent()

        // act
        await sut.execute(userId, from, to)

        // assert
        expect(getUserBalanceRepositorySpy).toHaveBeenCalledWith(
            userId,
            from,
            to,
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        getUserByIdRepositorySpy.mockRejectedValueOnce(new Error())
        const userId = faker.datatype.uuid()
        // act
        const promise = sut.execute(userId)
        // assert
        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        // arrange
        const { sut, getUserBalanceRepository } = makeSut()
        const getUserBalanceRepositorySpy = jest.spyOn(
            getUserBalanceRepository,
            'execute',
        )
        getUserBalanceRepositorySpy.mockRejectedValueOnce(new Error())
        const userId = faker.datatype.uuid()
        // act
        const promise = sut.execute(userId)
        // assert
        await expect(promise).rejects.toThrow(new Error())
    })
})
