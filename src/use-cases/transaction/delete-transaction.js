export class DeletetransactionUseCase {
    constructor(deleteTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
    }
    async execute(transactionId) {
        // chamar o repositório
        const deletedtransaction =
            await this.deleteTransactionRepository.execute(transactionId)

        return deletedtransaction
    }
}
