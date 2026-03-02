import { useState } from "react";
import { CheckCircle2, Database, Server, Monitor } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskForm } from "@/components/AddTaskForm";
import { StatusFilter } from "@/components/StatusFilter";
import type { TaskStatus } from "@/types/task";

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, filterByStatus } = useTasks();
  const [activeFilter, setActiveFilter] = useState<TaskStatus | "all">("all");
  const filtered = filterByStatus(activeFilter);

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container max-w-3xl py-6">
          <div className="flex items-center gap-3 mb-1">
            <CheckCircle2 className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              TaskFlow
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Gestionnaire de tâches — Lab Docker Compose
          </p>
          {/* Architecture badges */}
          <div className="flex gap-3 mt-4">
            {[
              { icon: Monitor, label: "Frontend", sub: "React" },
              { icon: Server, label: "Backend", sub: "Express" },
              { icon: Database, label: "Database", sub: "PostgreSQL" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-muted-foreground text-xs font-medium"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-accent-foreground">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-3xl py-8 space-y-6">
        <AddTaskForm onAdd={addTask} />

        <StatusFilter active={activeFilter} onChange={setActiveFilter} counts={counts} />

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Aucune tâche{activeFilter !== "all" ? " dans cette catégorie" : ""}.
            </p>
          ) : (
            filtered.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
