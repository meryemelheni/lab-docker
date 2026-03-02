import { useState, useCallback } from "react";
import type { Task, TaskStatus } from "@/types/task";

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Configurer Docker Compose",
    description: "Mettre en place le fichier docker-compose.yml avec les 3 services",
    status: "done",
    created_at: "2026-02-25T10:00:00Z",
  },
  {
    id: 2,
    title: "Créer l'API REST",
    description: "Implémenter les endpoints GET/POST/PUT/DELETE pour les tâches",
    status: "in_progress",
    created_at: "2026-02-26T14:30:00Z",
  },
  {
    id: 3,
    title: "Ajouter les health checks",
    description: "Configurer les HEALTHCHECK dans chaque Dockerfile",
    status: "todo",
    created_at: "2026-02-27T09:15:00Z",
  },
  {
    id: 4,
    title: "Tester l'isolation réseau",
    description: "Vérifier que le frontend ne peut pas contacter la database directement",
    status: "todo",
    created_at: "2026-02-28T08:00:00Z",
  },
];

let nextId = 5;

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const addTask = useCallback((title: string, description: string) => {
    const newTask: Task = {
      id: nextId++,
      title,
      description,
      status: "todo",
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id: number, updates: Partial<Pick<Task, "title" | "description" | "status">>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const filterByStatus = useCallback(
    (status: TaskStatus | "all") => {
      if (status === "all") return tasks;
      return tasks.filter((t) => t.status === status);
    },
    [tasks]
  );

  return { tasks, addTask, updateTask, deleteTask, filterByStatus };
}
