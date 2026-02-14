"use client";

import { useState } from "react";
import { Project, Task } from "@prisma/client";
import { Sidebar } from "@/components/sidebar";
import { CalendarView } from "@/components/calendar-view";
import { TaskBoard } from "@/components/task-board";
import { ListView } from "@/components/list-view";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

import { CreateTaskDialog } from "@/components/create-task-dialog";

interface MainLayoutProps {
    projects: Project[];
    tasks: (Task & { project: Project | null })[];
}

export function MainLayout({ projects, tasks }: MainLayoutProps) {
    const [activeView, setActiveView] = useState("calendar");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-50/20 via-background to-background dark:from-blue-950/10 transition-colors duration-500">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar
                    projects={projects}
                    activeView={activeView}
                    setActiveView={setActiveView}
                />
            </div>

            <div className="flex-1 flex flex-col min-w-0 relative">
                <header className="h-16 flex items-center px-4 md:px-8 justify-between glass z-20 mx-2 md:mx-6 mt-4 rounded-2xl shadow-sm border border-white/20 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        {/* Mobile Menu Trigger */}
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64 border-none bg-transparent">
                                <Sidebar
                                    projects={projects}
                                    activeView={activeView}
                                    setActiveView={(view) => {
                                        setActiveView(view);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full h-full border-r-0"
                                />
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-lg md:text-xl font-bold tracking-tight capitalize text-foreground/90">{activeView} View</h1>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />
                        <CreateTaskDialog projects={projects} trigger={
                            <Button size="sm" className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all">
                                <Plus className="mr-1 md:mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">New Task</span>
                                <span className="sm:hidden">Task</span>
                            </Button>
                        } />
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-2 md:p-6 relative">
                    <div className="absolute inset-0 p-2 md:p-6">
                        {activeView === "calendar" && <CalendarView tasks={tasks} projects={projects} />}
                        {activeView === "board" && <TaskBoard tasks={tasks} projects={projects} />}
                        {activeView === "list" && <ListView tasks={tasks} />}
                    </div>
                </main>
            </div>
        </div>
    );
}

