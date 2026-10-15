import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().min(1, 'Email / Username is required'),
    password: z.string().min(4, {
        message: 'Password must be at least 4 characters'
    })
})

export type LoginSchema = z.infer<typeof loginSchema>