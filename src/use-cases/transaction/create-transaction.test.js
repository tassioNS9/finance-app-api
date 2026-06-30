import { CreateTransactionUseCase } from './create-transaction'
import { UserNotFoundError } from '../../errors/user.js'
import { user } from '../../tests/fixtures/user.js'
import { transaction } from '../../tests/fixtures/transaction.js'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        ...transaction,
        id: undefined,
    }
    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return {
                ...user,
                id: userId,
            }
            // Simulate that a user exists with the given ID
        }
    }

    class CreateTransactionRepositoryStub {
        async execute() {
            return transaction // Simulate successful transaction creation
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'random_id' // Simulate unique ID generation
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            getUserByIdRepository,
            createTransactionRepository,
            idGeneratorAdapter,
        }
    }

    it('should create a new transaction successfully', async () => {
        const { sut } = makeSut()
        // Arrange
        const result = await sut.execute(createTransactionParams)

        // Assert
        expect(result).toEqual(transaction)
    })

    it('should call GetUserByIdRepository with the correct user ID', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(createTransactionParams)

        expect(getUserByIdSpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })

    it('should call IdGeneratorAdapter to generate a unique transaction ID', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        await sut.execute(createTransactionParams)

        expect(idGeneratorAdapterSpy).toHaveBeenCalled()
    })
    it('should call CreateTransactionRepository with the correct params', async () => {
        // arrange
        const { sut, createTransactionRepository } = makeSut()
        const createTransactionSpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        )
        //act
        await sut.execute(createTransactionParams)

        //assert
        expect(createTransactionSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random_id',
        })
    })

    it('should throw  UserNotFoundError if the user does not exist', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        //act
        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        // arrange
        const { sut, idGeneratorAdapter } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        //act
        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if CreateTransactionRepository throws', async () => {
        // arrange
        const { sut, createTransactionRepository } = makeSut()
        jest.spyOn(
            createTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow()
    })
})
