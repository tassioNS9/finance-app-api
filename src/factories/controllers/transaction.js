import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { PostgresCreateTransactionRepository } from '../../repositories/postgres/transaction/create-transaction.js'
import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import { CreateTransactionUseCase } from '../../use-cases/transaction/create-transaction.js'

export const makeCreateTransactionController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository
    )
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase
    )

    return createTransactionController
}
