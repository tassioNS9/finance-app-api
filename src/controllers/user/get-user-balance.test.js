import { GetUserBalanceController } from "./get-user-balance"
import { faker } from '@faker-js/faker'
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
})

