"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Project, Task } from "@prisma/client";
import { EditTaskDialog } from "@/components/edit-task-dialog";

interface CalendarViewProps {
    tasks: (Task & { project: Project | null })[];
    projects: Project[];
}

export function CalendarView({ tasks, projects }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [editingTask, setEditingTask] = useState<(Task & { project: Project | null }) | null>(null);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const today = new Date();

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="flex flex-col h-full glass rounded-3xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/20 border border-white/20 dark:border-white/5 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 bg-white/40 dark:bg-black/40 border-b border-white/10 dark:border-white/5 gap-4">
                <div className="flex flex-col">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground/90 leading-none">
                        {format(currentMonth, "MMMM")}
                    </h2>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground/60 mt-1">{format(currentMonth, "yyyy")}</p>
                </div>
                <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-xl md:p-1.5 md:rounded-2xl border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 md:h-9 md:w-9 rounded-xl hover:bg-white/20 dark:hover:bg-white/5">
                        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentMonth(today)}
                        className="px-3 md:px-4 font-bold rounded-xl hover:bg-white/20 dark:hover:bg-white/5 text-xs md:text-sm"
                    >
                        Today
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 md:h-9 md:w-9 rounded-xl hover:bg-white/20 dark:hover:bg-white/5">
                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 bg-white/20 dark:bg-black/20">
                {weekDays.map((day) => (
                    <div key={day} className="py-2 md:py-3 text-center text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 border-r border-white/10 dark:border-white/5 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-white/5 dark:bg-black/5 overflow-hidden">
                {days.map((day, dayIdx) => {
                    const dayTasks = tasks.filter(task =>
                        (task.dueDate && isSameDay(new Date(task.dueDate), day)) ||
                        (task.startTime && isSameDay(new Date(task.startTime), day))
                    );

                    const isToday = isSameDay(day, today);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "group p-1 md:p-2 border-b border-r border-white/10 dark:border-white/5 relative hover:bg-primary/[0.03] transition-all duration-300 min-h-0 min-w-0 overflow-hidden",
                                !isCurrentMonth && "opacity-30 grayscale-[0.5]",
                                (dayIdx + 1) % 7 === 0 && "border-r-0"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1 md:mb-2 text-[10px] md:text-xs">
                                <div className={cn(
                                    "font-bold w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-lg md:rounded-xl transition-all duration-300",
                                    isToday ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105" : "text-muted-foreground group-hover:text-foreground"
                                )}>
                                    {format(day, "d")}
                                </div>
                            </div>

                            <div className="space-y-1 max-h-[80px] md:max-h-[100px] overflow-y-auto scrollbar-none pr-0.5">
                                {dayTasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => setEditingTask(task)}
                                        className="text-[8px] md:text-[10px] font-black p-1 md:p-1.5 rounded-lg md:rounded-xl border border-white/20 dark:border-white/10 shadow-sm truncate transition-all hover:scale-[1.02] active:scale-95 cursor-pointer group/task relative"
                                        style={{
                                            backgroundColor: `${task.project?.color || '#3b82f6'}15`,
                                            color: task.project?.color || '#3b82f6',
                                            borderColor: `${task.project?.color || '#3b82f6'}30`
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            <div className="w-0.5 md:w-1 h-2 md:h-3 rounded-full shrink-0" style={{ backgroundColor: task.project?.color }} />
                                            <span className="truncate">{task.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

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

