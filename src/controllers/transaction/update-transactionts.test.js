import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transactions'

describe('Update Transaction Controller', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                id: faker.datatype.uuid(),
                user_id: faker.datatype.uuid(),
                name: faker.person.jobDescriptor(),
                date: faker.date.recent().toISOString(),
                type: faker.helpers.arrayElement([
                    'EXPENSE',
                    'EARNING',
                    'INVESTMENT',
                ]),
                amount: faker.datatype.number(),
                description: faker.lorem.sentence(),
            }
        }
    }
    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)
        return { updateTransactionUseCase, sut }
    }
    const httpRequest = {
        params: {
            transactionId: faker.datatype.uuid(),
        },
        body: {
            name: faker.person.jobDescriptor(),
            date: faker.date.recent().toISOString(),
            type: faker.helpers.arrayElement([
                'EXPENSE',
                'EARNING',
                'INVESTMENT',
            ]),
            amount: faker.datatype.number(),
            description: faker.lorem.sentence(),
        },
    }
    it('should return 200 when updating transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if transactionId is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            params: {
                transactionId: 'invalid_transaction_id',
            },
        })
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if amount is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                amount: 'invalid_amount',
            },
        })
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if type is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                type: 'invalid_type',
            },
        })
        expect(result.statusCode).toBe(400)
    })
})
