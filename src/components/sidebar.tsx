"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, LayoutList, CheckSquare, Hash, Settings } from "lucide-react";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { Project } from "@prisma/client";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    projects: Project[];
    activeView: string;
    setActiveView: (view: string) => void;
}

export function Sidebar({ className, projects, activeView, setActiveView }: SidebarProps) {
    return (
        <div className={cn("pb-12 w-64 glass-sidebar min-h-screen flex flex-col transition-all duration-300", className)}>
            <div className="space-y-6 py-6">
                <div className="px-6 flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <CheckSquare className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                        Zenith Flow
                    </h2>
                </div>

                <div className="px-3 space-y-1">
                    <div className="px-3 mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Views</p>
                    </div>
                    <Button
                        variant={activeView === "calendar" ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start transition-all duration-200 gap-3 px-4",
                            activeView === "calendar" && "bg-primary/10 text-primary hover:bg-primary/20 shadow-sm"
                        )}
                        onClick={() => setActiveView("calendar")}
                    >
                        <Calendar className="h-4 w-4" />
                        Calendar
                    </Button>
                    <Button
                        variant={activeView === "board" ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start transition-all duration-200 gap-3 px-4",
                            activeView === "board" && "bg-primary/10 text-primary hover:bg-primary/20 shadow-sm"
                        )}
                        onClick={() => setActiveView("board")}
                    >
                        <LayoutList className="h-4 w-4" />
                        Board
                    </Button>
                    <Button
                        variant={activeView === "list" ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start transition-all duration-200 gap-3 px-4",
                            activeView === "list" && "bg-primary/10 text-primary hover:bg-primary/20 shadow-sm"
                        )}
                        onClick={() => setActiveView("list")}
                    >
                        <CheckSquare className="h-4 w-4" />
                        List
                    </Button>
                </div>

                <div className="px-3 space-y-1">
                    <div className="px-3 flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Projects</p>
                        <CreateProjectDialog />
                    </div>
                    <ScrollArea className="h-[300px] -mx-1 px-1">
                        <div className="space-y-1 pr-2">
                            {projects.map((project) => (
                                <Button
                                    key={project.id}
                                    variant="ghost"
                                    className="w-full justify-start font-medium gap-3 hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                                >
                                    <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: project.color }} />
                                    {project.name}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <div className="px-3 mt-auto pt-4 border-t border-white/5">
                    <Button variant="ghost" className="w-full justify-start gap-3 opacity-60 hover:opacity-100 italic transition-all">
                        <Settings className="h-4 w-4" />
                        Settings
                    </Button>
                </div>
            </div>
        </div>
    );
}
