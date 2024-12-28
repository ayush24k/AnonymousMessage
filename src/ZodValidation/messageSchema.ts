import {z} from 'zod'

export const MessageSchema = z.object({
    content: z.string().max(300, {message: "conetent must be no longer than 300 characters"})
})