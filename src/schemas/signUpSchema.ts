import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters long")
    .max(16, "Username nust be atmost 16 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not conatin special charcters")

export const signUpSchema = z.object({
    name: z
        .string()
        .min(3, "Name should be atleast 3 charcters long")
        .max(30, "Name should be atmost 30 charcters long"),
    username: usernameValidation,
    email: z
        .string()
        .email({ message: "Invalid Email" }),
    password: z
        .string()
        .min(8, "Password must be atleast 8 charcters long"),
})