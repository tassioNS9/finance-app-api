import { PostgresGetUserByIdRepository } from '../repositories/postgres/get-user-by-id.js'
export class GetUserByIdCase {
    async execute(userId) {
        // chamar o repositório
        const getUserByIdRepository = new PostgresGetUserByIdRepository()

        const user = await getUserByIdRepository.execute(userId)

        return user
    }
}
