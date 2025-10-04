import { PostgresDeleteUserRepository } from '../repositories/postgres/delete-user.js'

export class DeleteUserUseCase {
    async execute(userId) {
        // chamar o repositório
        const postgresDeletedUserRepository = new PostgresDeleteUserRepository()

        const deletedUser = await postgresDeletedUserRepository.execute(userId)

        return deletedUser
    }
}
