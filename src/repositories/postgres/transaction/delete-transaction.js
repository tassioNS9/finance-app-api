import { PostgresHelper } from '../../helpers/postgres/postgres-helper.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        const deletedTransaction = await PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [transactionId]
        )

        return deletedTransaction[0]
    }
}
