import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be aleast 2 characters")
    .max(20, "username must not be longer than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special character")