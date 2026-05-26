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

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        const userId = faker.datatype.uuid()
        getUserByIdRepositorySpy.mockResolvedValue(user)
        // act
        const result = await sut.execute(userId)
        // assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId)
    })
})
