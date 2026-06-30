import { GetUserBalanceController } from './get-user-balance'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user.js'

describe('getUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
            return faker.number.int()
        }
    }
    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)

        return { sut, getUserBalanceUseCase }
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

    it('should return 200 when getting user balance', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const httpResponse = await sut.execute(httpRequest)

        // assert
        expect(httpResponse.statusCode).toBe(200)
    })

    it('should return 400 when userId is invalid', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const httpResponse = await sut.execute({
            ...httpRequest,
            params: {
                userId: 'invalid-uuid',
            },
        })

        // assert
        expect(httpResponse.statusCode).toBe(400)
    })

    it('should return 404 if userId is missing', async () => {
        //arrange
        const { sut, getUserBalanceUseCase } = makeSut()

        //act
        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )
        // act
        const httpResponse = await sut.execute(httpRequest)
        // assert
        expect(httpResponse.statusCode).toBe(404)
    })

    it('should return 500 if GetUserBalanceUseCase throws an error', async () => {
        // arrange
        const { sut, getUserBalanceUseCase } = makeSut()
        // O mockRejectedValueOnce é usado para simular uma rejeição de promessa, ou seja, um erro sendo lançado
        // dentro da função assíncrona.
        // Isso é útil para testar como o controlador lida com erros inesperados
        // que podem ocorrer durante a execução do caso de uso.
        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        // act
        const httpResponse = await sut.execute(httpRequest)
        // assert
        expect(httpResponse.statusCode).toBe(500)
    })
})
