import { z } from "zod";

export const signupUserSchema = z.object({
  name: z
    .string({
      required_error: "username is required",
      invalid_type_error: "username must be a string",
    })
    .min(2, { message: "username Must be 2 or more characters long" })
    .max(100, { message: "username Must be 2 or fewer characters long" }),
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email must be a string",
    })
    .min(3, { message: "email Must be 3 or more characters long" })
    .max(200, { message: "email Must be 3 or fewer characters long" }),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(6, { message: "password Must be 6 or more characters long" }),
});

export const loginUserSchema = z.object({
  email: z.string({
    required_error: "email is required",
    invalid_type_error: "email must be a string",
  }),
  password: z.string({
    required_error: "password is required",
  }),
});
