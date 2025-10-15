import { prisma } from '../../../../prisma/prisma.js'

export class PostgresUpdateTransactionsRepository {
    async execute(transactionId, updateTransactionParams) {
        const updatedTransaction = await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: updateTransactionParams,
        })

        return updatedTransaction
    }
}
