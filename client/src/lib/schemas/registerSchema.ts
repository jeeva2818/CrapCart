import { z } from 'zod'

const passwordValidation = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{6,10}$/
)

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(passwordValidation, {
        message: 'Password must contain one lowercase character, one uppercase character, one number, one special character and be 6 to 10 characters'
    })
})

export type RegisterSchema = z.infer<typeof registerSchema>