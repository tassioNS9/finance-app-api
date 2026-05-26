import bcript from 'bcrypt'

export class PasswordHasherAdapter {
    async execute(password) {
        return await bcript.hash(password, 10)
    }
}
