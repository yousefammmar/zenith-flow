"use client";

import { Project, Task } from "@prisma/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ListViewProps {
    tasks: (Task & { project: Project | null })[];
}

export function ListView({ tasks }: ListViewProps) {
    if (!tasks.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] glass rounded-3xl opacity-40 border-2 border-dashed border-muted-foreground/20 italic">
                <p>No tasks found</p>
            </div>
        );
    }

    return (
        <div className="glass rounded-3xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/20 border border-white/20 dark:border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-white/40 dark:bg-black/40 border-b border-white/10 dark:border-white/5">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="font-bold py-4">Title</TableHead>
                            <TableHead className="font-bold">Project</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="font-bold">Priority</TableHead>
                            <TableHead className="font-bold">Due Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow
                                key={task.id}
                                className="group hover:bg-white/30 dark:hover:bg-white/5 border-b border-white/10 dark:border-white/5 last:border-none transition-all cursor-pointer"
                            >
                                <TableCell className="py-4">
                                    <span className="font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                                        {task.title}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {task.project ? (
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: task.project.color }}
                                            />
                                            <span className="text-xs font-medium opacity-70">
                                                {task.project.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs opacity-40">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "rounded-lg px-2 py-0.5 text-[10px] font-black uppercase border-none",
                                            task.status === "DONE" ? "bg-green-500/10 text-green-500" :
                                                task.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-500" :
                                                    "bg-amber-500/10 text-amber-500"
                                        )}
                                    >
                                        {task.status.replace("_", " ")}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-[10px] font-bold border-white/20 dark:border-white/10 opacity-60",
                                            task.priority === "HIGH" && "text-red-500 border-red-500/20 opacity-100"
                                        )}
                                    >
                                        {task.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-xs font-medium opacity-60 italic">
                                    {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "No date"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
