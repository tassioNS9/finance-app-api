import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z.string().trim().min(1, {
        error: 'First name is requireeed.',
    }),
    last_name: z
        .string({
            error: 'Last name is requireeed.',
        })
        .trim()
        .min(1, {
            error: 'Last name is required',
        }),
    email: z
        .string({
            error: 'E-mail is required.',
        })
        .email({
            error: 'Please provide a valid e-mail.',
        })
        .trim()
        .min(1, {
            error: 'E-mail is required.',
        }),
    password: z
        .string({
            error: 'Password is required.',
        })
        .trim()
        .min(6, {
            error: 'Password must have at least 6 characters.',
        }),
})

export const updateUserSchema = createUserSchema.partial().strict({
    message: 'Some provided field is not allowed',
}) // Deixa os campos opcionais e o strict para exigir que aceite somente esses campos
