import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    color: z.string().optional().default("#3b82f6"),
    description: z.string().optional(),
});

export const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    projectId: z.string().optional(),
    dueDate: z.date().optional().nullable(),
    startTime: z.date().optional().nullable(),
    endTime: z.date().optional().nullable(),
    allDay: z.boolean().default(false),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
