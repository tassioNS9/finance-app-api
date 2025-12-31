import { ForbiddenError } from '../../errors/user.js'

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getTransactionByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }

    async execute(transactionId, params) {
        const transaction = await this.getTransactionByIdRepository.execute(
            transactionId
        )
        console.log(transaction, 'djsldsd')

        console.log(params, 'params')

        if (params.user_id && transaction.user_id !== params.user_id) {
            // Verifica se o ID da transação é refente ao usuário logado
            throw new ForbiddenError()
        }
        return await this.updateTransactionRepository.execute(
            transactionId,
            params
        )
    }
}
