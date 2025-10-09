import { UserNotFoundError } from '../../errors/user-not-found-error.js'

export class UpdateTransactionUseCase {
    constructor(updateTransactionsRepository, getUserByIdRepository) {
        this.updateTransactionsRepository = updateTransactionsRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        const transaction = await this.updateTransactionsRepository.execute(
            params
        )

        return transaction
    }
}
