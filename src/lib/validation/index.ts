// Importing zod for schema validation
import { z } from "zod";

// Schema for validating signup data
export const SignupValidation = z.object({
  // Validates the name field, requires a string with minimum length of 2 characters
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),

  // Validates the username field, requires a string with minimum length of 2 characters
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),

  // Validates the email field, requires a valid email format
  email: z.string().email(),

  // Validates the password field, requires a string with minimum length of 8 characters
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

// Schema for validating signin data
export const SigninValidation = z.object({
  // Validates the email field, requires a valid email format
  email: z.string().email(),

  // Validates the password field, requires a string with minimum length of 8 characters
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

// Schema for validating post data
export const PostValidation = z.object({
  // Validates the caption field, requires a string with minimum length of 5 and maximum length of 2200 characters
  caption: z.string().min(5).max(2200),

  // Validates the file field, custom validation for an array of files
  file: z.custom<File[]>(),

  // Validates the location field, requires a string with minimum length of 2 and maximum length of 10 characters
  location: z.string().min(2).max(10),

  // Validates the tags field, requires a string
  tags: z.string(),
});

// Schema for validating profile data
export const ProfileValidation = z.object({
  // Validates the file field, custom validation for an array of files
  file: z.custom<File[]>(),

  // Validates the name field, requires a string with minimum length of 2 characters
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),

  // Validates the username field, requires a string with minimum length of 2 characters
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),

  // Validates the email field, requires a valid email format
  email: z.string().email(),

  // Validates the bio field, requires a string
  bio: z.string(),
});
