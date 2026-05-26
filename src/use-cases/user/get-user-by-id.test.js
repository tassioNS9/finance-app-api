import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id'

describe('GetUserByIdUseCase', () => {
    const user = {
        id: faker.datatype.uuid(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 8,
        }),
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepository)
        return { sut, getUserByIdRepository }
    }

    it('should get user by id successfully', async () => {
        // arrange
        const { sut } = makeSut()
        const userId = faker.datatype.uuid()
        // act
        const result = await sut.execute(userId)
        // assert
        expect(result).toEqual(user)
    })
})
