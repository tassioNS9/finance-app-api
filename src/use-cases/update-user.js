import bcrypt from 'bcrypt'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'

export class UpdateUserUseCase {
    constructor(postgresUpdateUserRepository) {
        this.postgresUpdateUserRepository = postgresUpdateUserRepository
    }

    async execute(userId, updateUserParams) {
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()
        const existingUser = await postgresGetUserByEmailRepository.execute(
            updateUserParams.email
        )
        if (existingUser && existingUser.id !== userId) {
            throw new EmailAlreadyInUseError()
        }

        const user = {
            ...updateUserParams,
        }

        if (updateUserParams.password) {
            // criptografar a senha
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10
            )
            user.password = hashedPassword
        }
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            user
        )

        return updatedUser
    }
}
