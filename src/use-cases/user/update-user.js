import bcrypt from 'bcrypt'
import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
    }

    async execute(userId, updateUserParams) {
        const existingUser = await this.getUserByEmailRepository.execute(
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
        const updatedUser = await this.updateUserRepository.execute(
            userId,
            user
        )

        return updatedUser
    }
}
