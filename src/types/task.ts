export interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  created_at: string;
}

export type TaskStatus = Task["status"];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminée",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "secondary",
  in_progress: "warning",
  done: "success",
};
