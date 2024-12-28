import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be aleast 2 characters")
    .max(20, "username must not be longer than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special character")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must atleast six character"})
})