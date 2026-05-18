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
        const { sut } = makeSut()
        //arrange
        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
    })
})

