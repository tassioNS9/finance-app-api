import { CreateTransactionUseCase } from './create-transaction'
import { faker } from '@faker-js/faker'
describe('CreateTransactionUseCase', () => {
    const user = {
        first_name: faker.name.fullName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 8,
        }),
    }
    const createTransactionParams = {
        user_id: faker.datatype.uuid(),
        name: faker.person.jobDescriptor(),
        date: faker.date.recent().toISOString(),
        type: faker.helpers.arrayElement(['EXPENSE', 'EARNING', 'INVESTMENT']),
        amount: faker.datatype.number(),
    }
    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return {
                ...user,
                id: userId,
            }
            // Simulate that a user exists with the given ID
        }
    }

    class CreateTransactionRepositoryStub {
        async execute(transactionData) {
            return transactionData // Simulate successful transaction creation
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'random_id' // Simulate unique ID generation
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            getUserByIdRepository,
            createTransactionRepository,
            idGeneratorAdapter,
        }
    }

    it('should create a new transaction successfully', async () => {
        const { sut } = makeSut()
        // Arrange
        const result = await sut.execute(createTransactionParams)

        // Assert
        expect(result).toEqual({
            ...createTransactionParams,
            id: 'random_id',
        })
    })

    it('should call GetUserByIdRepository with the correct user ID', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(createTransactionParams)

        expect(getUserByIdSpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })

    it('should call IdGeneratorAdapter to generate a unique transaction ID', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        await sut.execute(createTransactionParams)

        expect(idGeneratorAdapterSpy).toHaveBeenCalled()
    })
    it('should call CreateTransactionRepository with the correct params', async () => {
        // arrange
        const { sut, createTransactionRepository } = makeSut()
        const createTransactionSpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        )
        //act
        await sut.execute(createTransactionParams)

        //assert
        expect(createTransactionSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random_id',
        })
    })
})
