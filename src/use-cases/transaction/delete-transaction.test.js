import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'

describe('DeleteTransactionUseCase', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.person.jobDescriptor(),
        date: faker.date.recent().toISOString(),
        type: faker.helpers.arrayElement(['EXPENSE', 'EARNING', 'INVESTMENT']),
        amount: faker.finance.amount(),
    }

    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                ...transaction,
                id: transactionId,
                // Simulate successful transaction deletion
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()

        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }

    it('should delete a transaction successfully', async () => {
        //arrange
        const { sut } = makeSut()
        const transactionId = faker.string.uuid()

        //act
        const result = await sut.execute(transactionId)
        expect(result).toEqual({ ...transaction, id: transactionId })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        //arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const transactionId = faker.string.uuid()
        const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute')

        //act
        await sut.execute(transactionId)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })
})
