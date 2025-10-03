import { PostgresHelper } from '../../db/postgres/helper.js'

export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        const updateFields = []
        const updateValues = []

        Object.keys(updateUserParams).forEach((key) => {
            updateFields.push(`${key} = $${updateFields.length + 1}`)
            updateValues.push(updateUserParams[key])
        })

        const updateQuery = `
            UPDATE users
            SET ${updateFields.join(', ')}
            WHERE id = $${updateFields.length}
            RETURNING *
        `

        const updatedUser = await PostgresHelper.query(
            updateQuery,
            updateValues
        )

        return updatedUser[0]
    }
}
