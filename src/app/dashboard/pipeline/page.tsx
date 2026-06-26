"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, DollarSign, GripVertical, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  contact: { firstName: string; lastName: string | null } | null;
}

interface Stage {
  id: string;
  name: string;
  color: string;
}

const defaultStages: Stage[] = [
  { id: "lead", name: "Lead", color: "#3B82F6" },
  { id: "contato", name: "Contato", color: "#8B5CF6" },
  { id: "proposta", name: "Proposta", color: "#F59E0B" },
  { id: "negociacao", name: "Negociação", color: "#F97316" },
  { id: "fechado", name: "Fechado", color: "#10B981" },
  { id: "perdido", name: "Perdido", color: "#EF4444" },
];

const emptyForm = { title: "", value: "", stage: "lead" };

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/deals?status=OPEN");
        const data = await res.json();
        setDeals(data.deals || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const getDealsByStage = (stageId: string) => deals.filter((d) => d.stage === stageId);
  const getStageTotal = (stageId: string) => getDealsByStage(stageId).reduce((s, d) => s + d.value, 0);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData("dealId", dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("dealId");
    await fetch("/api/deals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dealId, stage: stageId }),
    });
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: stageId } : d)));
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (deal: Deal) => {
    setEditingId(deal.id);
    setFormData({
      title: deal.title,
      value: String(deal.value),
      stage: deal.stage,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este deal?")) return;
    await fetch("/api/deals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      value: parseFloat(formData.value) || 0,
      stage: formData.stage,
    };

    if (editingId) {
      await fetch("/api/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setDialogOpen(false);
    setFormData(emptyForm);
    setEditingId(null);
    refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline"
        description="Arraste os deals entre estágios"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button />}>
              <Plus className="mr-2 h-4 w-4" /> Novo Deal
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Deal" : "Novo Deal"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Título *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Estágio</Label>
                  <Select value={formData.stage} onValueChange={(v) => setFormData({ ...formData, stage: v ?? "lead" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{defaultStages.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scroll-snap-x">
          {defaultStages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const stageTotal = getStageTotal(stage.id);
            return (
              <div
                key={stage.id}
                className="flex-shrink-0 w-72 md:w-80 scroll-snap-start"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="rounded-lg border bg-gray-50">
                  <div className="flex items-center justify-between border-b p-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: stage.color }} />
                      <h3 className="font-semibold">{stage.name}</h3>
                      <Badge variant="secondary">{stageDeals.length}</Badge>
                    </div>
                    <span className="text-sm font-medium text-gray-500">{formatCurrency(stageTotal)}</span>
                  </div>
                  <div className="p-2 space-y-2 min-h-[200px]">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        className="cursor-grab rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{deal.title}</h4>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(deal)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(deal.id)}>
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-green-600 font-medium">
                          <DollarSign className="h-4 w-4" />{formatCurrency(deal.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
