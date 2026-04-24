import { useState } from "react";
import { CheckCircle2, Database, Server, Monitor, Zap, TrendingUp } from "lucide-react";
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

  const completion = tasks.length > 0 ? Math.round((counts.done / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen pb-20">
      {/* Background Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full animate-float" />
      </div>

      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group cursor-pointer transition-transform hover:scale-105 active:scale-95">
              <CheckCircle2 className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text tracking-tight leading-none">TaskFlow</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold mt-1">K3s Orchestration</p>
            </div>
          </div>
          {/* Stack badges */}
          <div className="hidden sm:flex items-center gap-2">
            {[
              { icon: Monitor, label: "React", color: "text-cyan-400" },
              { icon: Server, label: "Express", color: "text-green-400" },
              { icon: Database, label: "Postgres", color: "text-blue-400" },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-default"
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        {/* Hero Section */}
        <div className="space-y-2 animate-fade-in">
          <h2 className="text-4xl font-extrabold tracking-tight gradient-text">Tableau de bord</h2>
          <p className="text-muted-foreground text-lg">Gérez vos déploiements et tâches en temps réel.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 animate-slide-up">
          {[
            { label: "À faire", count: counts.todo, icon: Zap, color: "slate", textColor: "text-slate-300", iconColor: "text-slate-400" },
            { label: "En cours", count: counts.in_progress, icon: TrendingUp, color: "amber", textColor: "text-amber-400", iconColor: "text-amber-400" },
            { label: "Terminées", count: counts.done, icon: CheckCircle2, color: "emerald", textColor: "text-emerald-400", iconColor: "text-emerald-400" },
          ].map((stat) => (
            <div 
              key={stat.label}
              className={`glass-card rounded-3xl p-6 flex flex-col gap-2 group hover:border-${stat.color}-500/30`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <p className={`text-4xl font-black ${stat.textColor} font-display tracking-tight`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {tasks.length > 0 && (
          <div className="glass rounded-3xl p-6 animate-slide-up space-y-4 border-white/[0.03]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Progression</span>
                <p className="text-sm text-muted-foreground/60">{counts.done} sur {tasks.length} tâches complétées</p>
              </div>
              <span className="font-black gradient-text-purple text-3xl">{completion}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden p-[2px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        )}

        {/* Add task form */}
        <div className="animate-slide-up pt-4" style={{ animationDelay: "100ms" }}>
          <AddTaskForm onAdd={addTask} />
        </div>

        <div className="space-y-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          {/* Filters */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold gradient-text">Mes tâches</h3>
            <StatusFilter active={activeFilter} onChange={setActiveFilter} counts={counts} />
          </div>

          {/* Task list */}
          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="glass rounded-3xl py-20 flex flex-col items-center gap-4 text-center animate-fade-in border-dashed border-white/5">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center animate-float">
                  <CheckCircle2 className="w-8 h-8 text-muted-foreground/20" />
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-bold text-lg">Tout est calme ici</p>
                  <p className="text-muted-foreground/40 text-sm">
                    {activeFilter !== "all" ? "Aucune tâche dans cette catégorie." : "Commencez par ajouter une nouvelle tâche."}
                  </p>
                </div>
              </div>
            ) : (
              filtered.map((task, i) => (
                <div key={task.id} className="animate-slide-up" style={{ animationDelay: `${i * 50 + 300}ms` }}>
                  <TaskCard task={task} onUpdate={updateTask} onDelete={deleteTask} />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
