import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'

describe('Get Transactions By User Id Use Case', () => {
    it('should return transactions by user id successfully', async () => {
        const user = {
            id: faker.datatype.uuid(),
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
        }
        const transactions = [
            {
                id: faker.string.uuid(),
                user_id: user.id,
                name: faker.person.jobDescriptor(),
                date: faker.date.recent().toISOString(),
                type: faker.helpers.arrayElement([
                    'EXPENSE',
                    'EARNING',
                    'INVESTMENT',
                ]),
                amount: faker.finance.amount(),
            },
            {
                id: faker.string.uuid(),
                user_id: user.id,
                name: faker.person.jobDescriptor(),
                date: faker.date.recent().toISOString(),
                type: faker.helpers.arrayElement([
                    'EXPENSE',
                    'EARNING',
                    'INVESTMENT',
                ]),
                amount: faker.finance.amount(),
            },
        ]

        class GetTransactionsByUserIdRepositoryStub {
            async execute() {
                return transactions
            }
        }

        class GetUserByIdRepositoryStub {
            async execute() {
                return user
            }
        }

        const makeSut = () => {
            const getTransactionsByUserIdRepository =
                new GetTransactionsByUserIdRepositoryStub()

            const getUserByIdRepository = new GetUserByIdRepositoryStub()

            const sut = new GetTransactionsByUserIdUseCase(
                getTransactionsByUserIdRepository,
                getUserByIdRepository,
            )

            return {
                sut,
                getTransactionsByUserIdRepository,
                getUserByIdRepository,
            }
        }

        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(user.id)

        //assert
        expect(result).toEqual(transactions)
    })
})
