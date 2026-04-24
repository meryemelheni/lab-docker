import { useState } from "react";
import { Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddTaskFormProps {
  onAdd: (title: string, description: string) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim());
    setTitle("");
    setDescription("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
    if (e.key === "Escape") { setOpen(false); setTitle(""); setDescription(""); }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full glass-card rounded-3xl p-5 flex items-center gap-4 text-muted-foreground hover:text-foreground border-dashed border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all duration-300 group"
      >
        <div className="w-10 h-10 rounded-2xl bg-violet-500/10 group-hover:bg-violet-500/20 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-90">
          <Plus className="w-5 h-5 text-violet-400" />
        </div>
        <span className="text-lg font-bold tracking-tight">Nouvelle tâche...</span>
        <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">Ctrl + Enter</span>
        </div>
      </button>
    );
  }

  return (
    <div className="glass-strong rounded-3xl p-6 space-y-5 animate-scale-in border-violet-500/30 shadow-2xl shadow-violet-500/20" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <span className="text-lg font-black gradient-text uppercase tracking-widest">Créer une tâche</span>
        </div>
        <button
          onClick={() => { setOpen(false); setTitle(""); setDescription(""); }}
          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-violet-400 px-1">Titre de la mission</label>
          <Input
            placeholder="Qu'allez-vous accomplir ?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-violet-500/20 rounded-2xl h-12 font-bold text-lg"
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-violet-400 px-1">Détails (optionnel)</label>
          <Textarea
            placeholder="Ajoutez des notes ou des étapes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-violet-500/20 rounded-2xl resize-none p-4 text-base"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
          <kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">Ctrl</kbd>
          <span>+</span>
          <kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">Enter</kbd>
          <span className="ml-1">pour valider</span>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => { setOpen(false); setTitle(""); setDescription(""); }}
            className="rounded-2xl h-11 px-6 font-bold text-muted-foreground hover:bg-white/5 hover:text-white transition-all"
          >
            Annuler
          </Button>
          <Button
            onClick={submit}
            disabled={!title.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:grayscale text-white rounded-2xl h-11 px-8 font-extrabold shadow-lg shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 flex gap-2"
          >
            <Plus className="w-4 h-4" /> Créer la tâche
          </Button>
        </div>
      </div>
    </div>
  );
}
