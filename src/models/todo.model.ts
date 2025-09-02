import { z } from "zod";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, "title is required"),
    completed: z.boolean().optional()
  })
});

export const updateTodoSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required"
  })
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() })
});

export type CreateTodoDTO = z.infer<typeof createTodoSchema>["body"];
export type UpdateTodoDTO = z.infer<typeof updateTodoSchema>["body"];
