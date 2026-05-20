import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'
describe('getUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }
    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 if a user is found', async () => {
        // arrange
        const { sut } = makeSut()
        // act
        const httpResponse = await sut.execute(httpRequest)
        // assert
        expect(httpResponse.statusCode).toBe(200)
    })
})
