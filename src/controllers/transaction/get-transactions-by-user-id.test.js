import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'

describe('GetTransactionsByUserIdController', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            ;[
                {
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
                    description: 'Test transaction',
                },
            ]
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        )
        return { sut, getTransactionsByUserIdUseCase }
    }
    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        query: {
            from: faker.date.past().toISOString().split('T')[0],
            to: faker.date.recent().toISOString().split('T')[0],
        },
    }

    it('should return 200 when getting transactions successfully', async () => {
        // arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when userId is missing', async () => {
        // arrange
        const { sut } = makeSut()
        const invalidHttpRequest = {
            ...httpRequest,
            params: {},
        }
        // act
        const result = await sut.execute(invalidHttpRequest)
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when userId is invalid', async () => {
        // arrange
        const { sut } = makeSut()
        const invalidHttpRequest = {
            ...httpRequest,
            params: {
                userId: 'invalid-user-id',
            },
        }
        // act
        const result = await sut.execute(invalidHttpRequest)
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when from date is invalid', async () => {
        // arrange
        const { sut } = makeSut()
        const invalidHttpRequest = {
            ...httpRequest,
            query: {
                from: 'invalid-date',
                to: faker.date.recent().toISOString().split('T')[0],
            },
        }
        // act
        const result = await sut.execute(invalidHttpRequest)
        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when to date is invalid', async () => {
        // arrange
        const { sut } = makeSut()
        const invalidHttpRequest = {
            ...httpRequest,
            query: {
                from: faker.date.past().toISOString().split('T')[0],
                to: 'invalid-date',
            },
        }
        // act
        const result = await sut.execute(invalidHttpRequest)
        // assert
        expect(result.statusCode).toBe(400)
    })
})
