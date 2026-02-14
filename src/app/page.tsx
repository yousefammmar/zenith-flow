import { MainLayout } from "@/components/main-layout";
import { getProjects } from "@/actions/project";
import { getTasks } from "@/actions/task";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projectsResult, tasksResult] = await Promise.all([
    getProjects(),
    getTasks()
  ]);

  const projects = projectsResult.success && projectsResult.data ? projectsResult.data : [];
  const tasks = tasksResult.success && tasksResult.data ? tasksResult.data : [];

  return (
    <MainLayout projects={projects} tasks={tasks} />
  );
}
