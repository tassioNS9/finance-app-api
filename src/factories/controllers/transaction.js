import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { PostgresCreateTransactionRepository } from '../../repositories/postgres/transaction/create-transaction.js'
import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import { CreateTransactionUseCase } from '../../use-cases/transaction/create-transaction.js'
import { GetTransactionsByUserIdController } from '../../controllers/transaction/get-transactions-by-user-id.js'
import { GetTransactionsByUserIdUseCase } from '../../use-cases/transaction/get-transactions-by-user-id.js'
import { PostgresGetTransactionsByUserId } from '../../repositories/postgres/transaction/get-transactions-by-user-id.js'
import { UpdateTransactionController } from '../../controllers/transaction/update-transactions.js'
import { UpdateTransactionUseCase } from '../../use-cases/transaction/update-transactions.js'
import { PostgresUpdateTransactionsRepository } from '../../repositories/postgres/transaction/update-transactions.js'

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

export const makeGetTransactionsByUserIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserId()
    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionsByUserIdRepository,
        getUserByIdRepository
    )
    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase)
    return getTransactionsByUserIdController
}

export const makeUpdateTransactionController = () => {
    const updateTrasactionRepository =
        new PostgresUpdateTransactionsRepository()

    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTrasactionRepository
    )

    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase
    )

    return updateTransactionController
}
