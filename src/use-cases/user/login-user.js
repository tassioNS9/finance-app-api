import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export class LoginUserUseCase {
    constructor(getUserByEmailRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
    }
    async execute(login, password) {
        // Verificar se o email é válido (se possui um usuário com esse email!)
        const user = await this.getUserByEmailRepository.execute(login)

        if (!user) {
            throw new UserNotFoundError()
        }

        const isPasswordValid = bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        const tokens = {
            accessToken: jwt.sign(
                { userId: user.id },
                process.env.JWT_ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            ),

            refreshToken: jwt.sign(
                { userId: user.id },
                process.env.JWT_REFRESH_TOKEN_SECRET,
                { expiresIn: '30d' }
            ),
        }

        return {
            ...user,
            tokens,
        }
    }
}
