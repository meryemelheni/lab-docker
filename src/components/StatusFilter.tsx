import { Button } from "@/components/ui/button";
import type { TaskStatus } from "@/types/task";

interface StatusFilterProps {
  active: TaskStatus | "all";
  onChange: (status: TaskStatus | "all") => void;
  counts: Record<TaskStatus | "all", number>;
}

const FILTERS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "todo", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminées" },
];

export function StatusFilter({ active, onChange, counts }: StatusFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map((f) => (
        <Button
          key={f.value}
          size="sm"
          variant={active === f.value ? "default" : "outline"}
          onClick={() => onChange(f.value)}
          className="gap-1.5"
        >
          {f.label}
          <span className="text-xs opacity-70">({counts[f.value]})</span>
        </Button>
      ))}
    </div>
  );
}
