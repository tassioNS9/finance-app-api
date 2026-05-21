import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute(transaction) {
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
            ...httpRequest,
            params: {
                transactionId: 'invalid-uuid',
            },
        })
        // assert
        expect(result.statusCode).toBe(400)
    })
})
