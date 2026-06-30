import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction } from '../../tests/fixtures/transaction.js'

describe('GetTransactionsByUserIdController', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            ;[transaction]
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
            params: { userId: undefined },
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

    it('should return 404 when GetTransactionsByUserIdUseCase throws UserNotFoundError', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetTransactionsByUserIdUseCase throws an error', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error())
        // act
        const result = await sut.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetTransactionsByUserIdUseCase with correct params', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getTransactionsByUserIdUseCase, 'execute')
        // act
        await sut.execute(httpRequest)
        // assert
        expect(executeSpy).toHaveBeenCalledWith({
            userId: httpRequest.params.userId,
            from: httpRequest.query.from,
            to: httpRequest.query.to,
        })
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })
})
