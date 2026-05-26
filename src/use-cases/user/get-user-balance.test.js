import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance'

describe('getUserBalanceUseCase', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return faker.datatype.number()
        }
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.datatype.uuid(),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
            }
        }
    }
    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )
        return { sut, getUserBalanceRepository, getUserByIdRepository }
    }

    it('should get user balance successfully', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const balance = await sut.execute()
        // assert

        expect(balance).toBeTruthy()
    })
})
