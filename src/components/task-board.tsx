"use client";

import { useState } from "react";
import { Project, Task } from "@prisma/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditTaskDialog } from "@/components/edit-task-dialog";

interface TaskBoardProps {
    tasks: (Task & { project: Project | null })[];
    projects: Project[];
}

const columns = [
    { id: "TODO", title: "To Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "DONE", title: "Done" },
];

export function TaskBoard({ tasks, projects }: TaskBoardProps) {
    const [editingTask, setEditingTask] = useState<(Task & { project: Project | null }) | null>(null);

    return (
        <div className="flex h-full gap-4 md:gap-8 p-0 md:p-2 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-muted-foreground/20">
            {columns.map((col) => {
                const colTasks = tasks.filter((task) => task.status === col.id);
                return (
                    <div key={col.id} className="flex-shrink-0 w-[280px] md:w-80 flex flex-col h-full glass rounded-[1.5rem] md:rounded-[2rem] border border-white/20 dark:border-white/5 shadow-xl shadow-black/5 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-4 md:p-6 flex justify-between items-center bg-white/30 dark:bg-black/30 rounded-t-[1.5rem] md:rounded-t-[2rem] border-b border-white/10 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-extrabold tracking-tight text-foreground/80">{col.title}</h3>
                                <Badge variant="secondary" className="rounded-xl px-2.5 py-0.5 text-[10px] font-black uppercase bg-primary/10 text-primary border-none">
                                    {colTasks.length}
                                </Badge>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl opacity-40 hover:opacity-100 italic transition-all">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4 pr-2">
                                {colTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => setEditingTask(task)}
                                        className="group bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/40 dark:border-white/5 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer active:scale-95"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                {task.project && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ backgroundColor: task.project.color }} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: task.project.color }}>
                                                            {task.project.name}
                                                        </span>
                                                    </div>
                                                )}
                                                <Badge variant="outline" className="text-[8px] border-white/20 dark:border-white/10 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    {task.priority || "MEDIUM"}
                                                </Badge>
                                            </div>
                                            <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                                                {task.title}
                                            </h4>
                                            {task.description && (
                                                <p className="text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-muted-foreground/10 flex items-center justify-center text-[8px] font-black">
                                                        YP
                                                    </div>
                                                    <span className="text-[10px] font-medium italic">You</span>
                                                </div>
                                                <span className="text-[10px] font-bold">
                                                    {task.dueDate ? format(new Date(task.dueDate), "MMM d") : "No date"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {colTasks.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 opacity-20 border-2 border-dashed border-muted-foreground/20 rounded-3xl italic">
                                        <p className="text-xs">No tasks yet</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                );
            })}

            {editingTask && (
                <EditTaskDialog
                    task={editingTask as any}
                    projects={projects}
                    open={!!editingTask}
                    onOpenChange={(open) => !open && setEditingTask(null)}
                />
            )}
        </div>
    );
}

