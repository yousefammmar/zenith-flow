"use server";

import prisma from "@/lib/prisma";
import { projectSchema, ProjectInput } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function createProject(data: ProjectInput) {
    const result = projectSchema.safeParse(data);
    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    try {
        const project = await prisma.project.create({
            data: result.data,
        });
        revalidatePath("/");
        return { success: true, data: project };
    } catch (error) {
        return { success: false, error: "Failed to create project" };
    }
}

export async function getProjects() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: projects };
    } catch (error) {
        return { success: false, error: "Failed to fetch projects" };
    }
}

export async function deleteProject(id: string) {
    try {
        await prisma.project.delete({
            where: { id },
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete project" };
    }
}
