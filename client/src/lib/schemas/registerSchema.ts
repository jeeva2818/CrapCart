import { z } from 'zod'

export const registerSchema = z.object({
    email: z.string().min(3, 'Username/Email is required'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    role: z.enum(['Buyer', 'Seller'])
})

export type RegisterSchema = z.infer<typeof registerSchema>