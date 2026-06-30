import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transactions'
import { ForbiddenError } from '../../errors/user.js'

describe('Update Transactions Use Case', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        amount: faker.number.int({ min: 1, max: 1000 }),
        description: faker.lorem.sentence(),
        date: faker.date.recent().toISOString(),
    }

    class UpdateTransactionsRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionsRepository =
            new UpdateTransactionsRepositoryStub()
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()
        const sut = new UpdateTransactionUseCase(
            updateTransactionsRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            updateTransactionsRepository,
            getTransactionByIdRepository,
        }
    }

    it('should update transaction successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(transaction.id, {
            amount: faker.number.int({ min: 1, max: 1000 }),
        })

        //assert
        expect(result).toEqual(transaction)
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        // arrange
        const { sut, updateTransactionsRepository } = makeSut()

        const updateTransactionRepositorySpy = jest.spyOn(
            updateTransactionsRepository,
            'execute',
        )

        // act
        await sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        // assert
        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
            {
                amount: transaction.amount,
            },
        )
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        // arrange
        const { sut, updateTransactionsRepository } = makeSut()
        const updateTransactionRepositorySpy = jest.spyOn(
            updateTransactionsRepository,
            'execute',
        )
        updateTransactionRepositorySpy.mockRejectedValue(new Error())
        // act
        const promise = sut.execute(transaction.id, {
            amount: transaction.amount,
        })
        //assert
        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw ForbiddenError if user_id is different from transaction user_id', async () => {
        // arrange
        const { sut } = makeSut()
        const differentUserId = faker.string.uuid()

        // act
        const promise = sut.execute(transaction.id, {
            amount: transaction.amount,
            user_id: differentUserId,
        })

        // assert
        await expect(promise).rejects.toThrow(new ForbiddenError())
    })
})
