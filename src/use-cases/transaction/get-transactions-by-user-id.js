export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRepository) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
    }

    async execute(transactionId, params) {
        const transactions =
            await this.getTransactionsByUserIdRepository.execute(
                transactionId,
                params
            )

        return transactions
    }
}
