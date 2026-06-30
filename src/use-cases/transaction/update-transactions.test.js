import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transactions'

describe('Update Transactions Use Case', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    const transaction = {
        id: faker.string.uuid(),
        user_id: user.id,
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

    // it('should call UpdateTransactionRepository with correct params', async () => {
    //     // arrange
    //     const { sut, updateTransactionRepository } = makeSut()

    //     const updateTransactionRepositorySpy = jest.spyOn(
    //         updateTransactionRepository,
    //         'execute',
    //     )

    //     // act
    //     await sut.execute(transaction.id, {
    //         amount: transaction.amount,
    //     })

    //     // assert
    //     expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
    //         transaction.id,
    //         {
    //             amount: transaction.amount,
    //         },
    //     )
    // })
})
