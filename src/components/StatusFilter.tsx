import type { TaskStatus } from "@/types/task";

interface StatusFilterProps {
  active: TaskStatus | "all";
  onChange: (status: TaskStatus | "all") => void;
  counts: Record<TaskStatus | "all", number>;
}

const FILTERS: {
  value: TaskStatus | "all";
  label: string;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    value: "all",
    label: "Toutes",
    activeClass: "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20",
    inactiveClass: "bg-white/5 text-muted-foreground border-white/8 hover:border-violet-500/30 hover:text-foreground",
  },
  {
    value: "todo",
    label: "À faire",
    activeClass: "bg-slate-600 text-white border-slate-500 shadow-lg shadow-slate-500/20",
    inactiveClass: "bg-white/5 text-muted-foreground border-white/8 hover:border-slate-500/30 hover:text-foreground",
  },
  {
    value: "in_progress",
    label: "En cours",
    activeClass: "bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-500/20",
    inactiveClass: "bg-white/5 text-muted-foreground border-white/8 hover:border-amber-500/30 hover:text-foreground",
  },
  {
    value: "done",
    label: "Terminées",
    activeClass: "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20",
    inactiveClass: "bg-white/5 text-muted-foreground border-white/8 hover:border-emerald-500/30 hover:text-foreground",
  },
];

export function StatusFilter({ active, onChange, counts }: StatusFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
            active === f.value ? f.activeClass : f.inactiveClass
          }`}
        >
          {f.label}
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-lg text-xs font-bold ${
              active === f.value ? "bg-white/20" : "bg-white/8"
            }`}
          >
            {counts[f.value]}
          </span>
        </button>
      ))}
    </div>
  );
}
