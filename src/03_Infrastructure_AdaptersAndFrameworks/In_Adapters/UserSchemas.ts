import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().int().min(0, "Age must be non-negative"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().int().min(0, "Age must be non-negative"),
});
