import { EmailAlreadyInUseError } from '../../errors/user.js'
import { badRequest, created, serverError } from '../helpers/http.js'
import { z, ZodError } from 'zod'
export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const createUserSchema = z.object({
                first_name: z.string().trim().min(1, {
                    message: 'First name is requireeed.',
                }),
                last_name: z
                    .string({
                        required_error: 'Last name is requireeed.',
                    })
                    .trim()
                    .min(1, {
                        message: 'Last name is required',
                    }),
                email: z
                    .string({
                        required_error: 'E-mail is required.',
                    })
                    .email({
                        message: 'Please provide a valid e-mail.',
                    })
                    .trim()
                    .min(1, {
                        message: 'E-mail is required.',
                    }),
                password: z
                    .string({
                        required_error: 'Password is required.',
                    })
                    .trim()
                    .min(6, {
                        message: 'Password must have at least 6 characters.',
                    }),
            })

            await createUserSchema.parseAsync(params)

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.message,
                })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
