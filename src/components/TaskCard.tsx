import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Task, TaskStatus } from "@/types/task";
import { STATUS_LABELS } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, updates: Partial<Pick<Task, "title" | "description" | "status">>) => void;
  onDelete: (id: number) => void;
}

const statusBadgeClass: Record<TaskStatus, string> = {
  todo: "bg-secondary text-secondary-foreground",
  in_progress: "bg-warning/15 text-warning border-warning/30",
  done: "bg-accent text-accent-foreground",
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

  if (editing) {
    return (
      <Card className="animate-fade-in border-primary/30 shadow-md">
        <CardContent className="p-4 space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="font-display font-semibold" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">À faire</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="done">Terminée</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={save}><Check className="w-4 h-4 mr-1" />Sauver</Button>
            <Button size="sm" variant="ghost" onClick={cancel}><X className="w-4 h-4 mr-1" />Annuler</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-card-foreground truncate">{task.title}</h3>
              <Badge variant="outline" className={statusBadgeClass[task.status]}>
                {STATUS_LABELS[task.status]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
            <span className="text-xs text-muted-foreground mt-2 block">{date}</span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(true)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(task.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
