import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transactions'

describe('Update Transaction Controller', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.person.jobDescriptor(),
                date: faker.date.recent().toISOString(),
                type: faker.helpers.arrayElement([
                    'EXPENSE',
                    'EARNING',
                    'INVESTMENT',
                ]),
                amount: faker.datatype.number(),
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
            transactionId: faker.string.uuid(),
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
    it('should return 400 if date is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                date: 'invalid_date',
            },
        })
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when unallowed fields are provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                unallowedField: 'unallowed_value',
            },
        })
        expect(result.statusCode).toBe(400)
    })
    it('should call UpdateTransactionUseCase with correct params', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body,
        )
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })

    it('should return 500 if an unexpected error occurs', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut()
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        // act
        const result = await sut.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(500)
    })
})
