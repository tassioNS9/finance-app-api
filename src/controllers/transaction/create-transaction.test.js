import { CreateTransactionController } from './create-transaction'
import { faker } from '@faker-js/faker'
describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute(transactionData) {
            return transactionData
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)
        return { createTransactionUseCase, sut }
    }
    const httpRequest = {
        body: {
            user_id: faker.datatype.uuid(),
            name: faker.person.jobDescriptor(),
            date: faker.date.recent().toISOString(),
            type: faker.helpers.arrayElement([
                'EXPENSE',
                'EARNING',
                'INVESTMENT',
            ]),
            amount: faker.datatype.number(),
            description: 'Test transaction',
        },
    }
    it('should return 201 when creating a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const result = await sut.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(httpRequest.body)
    })

    it('should return 400 if user_id is not provided', async () => {
        // arrange
        const { sut } = makeSut()
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                user_id: undefined,
            },
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                name: undefined,
            },
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if date is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                date: undefined,
            },
        })
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if type is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                type: undefined,
            },
        })
        // assert
        expect(result.statusCode).toBe(400)
    })
})
