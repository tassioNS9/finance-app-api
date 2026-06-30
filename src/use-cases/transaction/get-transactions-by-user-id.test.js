import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('Get Transactions By User Id Use Case', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        }
    }
    it('should return transactions by user id successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(user.id)

        //assert
        expect(result).toEqual([])
    })

    it('should throw UserNotFoundError if user is not found', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)
        const userId = faker.string.uuid()
        //act
        const promise = sut.execute(userId)

        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    // it('should call GetUserByIdRepository with correct params', async () => {
    //     //arrange
    //     const { sut, getUserByIdRepository } = makeSut()
    //     const getUserByIdRepositorySpy = jest.spyOn(
    //         getUserByIdRepository,
    //         'execute',
    //     )
    //     const userId = faker.string.uuid()
    //     console.log('userId', userId)
    //     //act
    //     await sut.execute(userId)

    //     //assert
    //     expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId)
    // })
})
