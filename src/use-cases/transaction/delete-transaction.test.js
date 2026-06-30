import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { transaction } from '../../tests/fixtures/transaction.js'

describe('DeleteTransactionUseCase', () => {
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

    it('should throw if DeleteTransactionRepository throws', async () => {
        //arrange
        const { sut, deleteTransactionRepository } = makeSut()
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(faker.string.uuid())

        //assert
        await expect(promise).rejects.toThrow()
    })
})
