import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'
import { transaction } from '../../tests/fixtures/transaction.js'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)
        return { deleteTransactionUseCase, sut }
    }
    const httpRequest = {
        params: {
            transactionId: faker.datatype.uuid(),
        },
    }
    it('should return 200 when deleting a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const result = await sut.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(200)
    })
    it('should return 400 if transactionId is not a valid uuid', async () => {
        // arrange
        const { sut } = makeSut()
        const result = await sut.execute({
            params: {
                transactionId: 'invalid-uuid',
            },
        })
        // assert
        expect(result.statusCode).toBe(400)
    })
    it('should return 404 if transaction to delete is not found', async () => {
        // arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValue(null)
        // act
        const result = await sut.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when DeleteTransactionUseCase throws an error', async () => {
        // arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        // act
        const result = await sut.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct transactionId', async () => {
        // arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')
        // act
        await sut.execute(httpRequest)
        // assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
        )
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })
})
