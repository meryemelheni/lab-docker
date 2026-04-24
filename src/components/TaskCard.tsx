import { useState } from "react";
import { Pencil, Trash2, Check, X, Calendar, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Task, TaskStatus } from "@/types/task";
import { STATUS_LABELS } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, updates: Partial<Pick<Task, "title" | "description" | "status">>) => void;
  onDelete: (id: number) => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; dot: string; badge: string; border: string }> = {
  todo: {
    label: "À faire",
    dot: "bg-slate-400",
    badge: "bg-slate-500/10 text-slate-400 border-slate-500/10",
    border: "group-hover:border-slate-500/30",
  },
  in_progress: {
    label: "En cours",
    dot: "bg-amber-400 animate-pulse",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/10",
    border: "group-hover:border-amber-500/30",
  },
  done: {
    label: "Terminée",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
    border: "group-hover:border-emerald-500/30",
  },
};

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const save = () => {
    onUpdate(task.id, { title, description, status });
    setEditing(false);
  };

  const cancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setEditing(false);
  };

  const date = new Date(task.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });

  const cfg = STATUS_CONFIG[task.status];

  if (editing) {
    return (
      <div className="glass-strong rounded-3xl p-6 space-y-4 animate-scale-in border-violet-500/30 shadow-2xl shadow-violet-500/10">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-violet-400 px-1">Titre</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-bold text-lg bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-violet-500/20 rounded-2xl h-12"
            placeholder="Titre de la tâche"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-violet-400 px-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-violet-500/20 rounded-2xl resize-none p-4"
            placeholder="Détaillez votre tâche..."
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-violet-400 px-1">Statut</label>
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger className="w-48 bg-white/5 border-white/10 rounded-2xl h-11 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 rounded-2xl">
                <SelectItem value="todo">À faire</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="done">Terminée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 self-end">
            <Button
              variant="ghost"
              onClick={cancel}
              className="rounded-2xl h-11 px-6 font-bold text-muted-foreground hover:bg-white/5 hover:text-white transition-all"
            >
              Annuler
            </Button>
            <Button
              onClick={save}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-2xl h-11 px-8 font-bold shadow-lg shadow-violet-600/20 transition-all hover:scale-105 active:scale-95"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group glass rounded-3xl p-6 transition-all duration-300 hover:bg-white/[0.04] border-transparent hover:translate-x-1 ${cfg.border} border-l-4 ${cfg.border.replace("hover:", "")}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${cfg.badge}`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground/40 font-bold text-[10px] uppercase tracking-wider">
              <Calendar className="w-3 h-3" />
              {date}
            </div>
          </div>
          <div className="space-y-1">
            <h3 className={`text-xl font-bold tracking-tight transition-all ${task.status === "done" ? "text-muted-foreground/50 line-through" : "text-foreground"}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm leading-relaxed transition-all ${task.status === "done" ? "text-muted-foreground/30" : "text-muted-foreground"}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditing(true)}
            className="w-10 h-10 rounded-xl hover:bg-violet-500/10 hover:text-violet-400 transition-all"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
