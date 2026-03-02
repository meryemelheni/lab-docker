import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

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

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-full gap-2" size="lg">
        <Plus className="w-5 h-5" /> Nouvelle tâche
      </Button>
    );
  }

  return (
    <Card className="animate-fade-in border-primary/30 shadow-md">
      <CardContent className="p-4 space-y-3">
        <Input
          placeholder="Titre de la tâche"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-display font-semibold"
          autoFocus
        />
        <Textarea
          placeholder="Description (optionnel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        <div className="flex gap-2">
          <Button onClick={submit} disabled={!title.trim()}>
            <Plus className="w-4 h-4 mr-1" /> Ajouter
          </Button>
          <Button variant="ghost" onClick={() => { setOpen(false); setTitle(""); setDescription(""); }}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
