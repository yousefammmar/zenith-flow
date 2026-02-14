"use server";

import prisma from "@/lib/prisma";
import { taskSchema, TaskInput } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function createTask(data: TaskInput) {
    const result = taskSchema.safeParse(data);
    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    try {
        const task = await prisma.task.create({
            data: result.data,
        });
        revalidatePath("/");
        return { success: true, data: task };
    } catch (error) {
        return { success: false, error: "Failed to create task" };
    }
}

export async function updateTask(id: string, data: Partial<TaskInput>) {
    try {
        const task = await prisma.task.update({
            where: { id },
            data: data,
        });
        revalidatePath("/");
        return { success: true, data: task };
    } catch (error) {
        return { success: false, error: "Failed to update task" };
    }
}

export async function deleteTask(id: string) {
    try {
        await prisma.task.delete({
            where: { id },
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete task" };
    }
}

export async function getTasks() {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                project: true,
            },
        });
        return { success: true, data: tasks };
    } catch (error) {
        return { success: false, error: "Failed to fetch tasks" };
    }
}
