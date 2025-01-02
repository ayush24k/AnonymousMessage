import {z} from 'zod'
import { usernameValidation } from './usernameValidation'


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must atleast six character"})
})