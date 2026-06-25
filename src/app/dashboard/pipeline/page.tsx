"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, DollarSign, GripVertical } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Deal { id: string; title: string; value: number; stage: string; contact: { firstName: string; lastName: string | null } | null; }
interface Stage { id: string; name: string; color: string; }

const defaultStages: Stage[] = [
  { id: "lead", name: "Lead", color: "#3B82F6" },
  { id: "contato", name: "Contato", color: "#8B5CF6" },
  { id: "proposta", name: "Proposta", color: "#F59E0B" },
  { id: "negociacao", name: "Negociação", color: "#F97316" },
  { id: "fechado", name: "Fechado", color: "#10B981" },
  { id: "perdido", name: "Perdido", color: "#EF4444" },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", value: "", stage: "lead" });

  useEffect(() => { fetchDeals(); }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try { const res = await fetch("/api/deals?status=OPEN"); const data = await res.json(); setDeals(data.deals || []); }
    catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const getDealsByStage = (stageId: string) => deals.filter((d) => d.stage === stageId);
  const getStageTotal = (stageId: string) => getDealsByStage(stageId).reduce((s, d) => s + d.value, 0);

  const handleDragStart = (e: React.DragEvent, dealId: string) => { e.dataTransfer.setData("dealId", dealId); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("dealId");
    await fetch("/api/deals", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: dealId, stage: stageId }) });
    setDeals((prev) => prev.map((d) => d.id === dealId ? { ...d, stage: stageId } : d));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/deals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: formData.title, value: parseFloat(formData.value) || 0, stage: formData.stage }) });
    if (res.ok) { setDialogOpen(false); setFormData({ title: "", value: "", stage: "lead" }); fetchDeals(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-900">Pipeline</h2><p className="text-gray-600">Arraste os deals entre estágios</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> Novo Deal
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Novo Deal</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Título *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Valor</Label><Input type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} /></div>
              <div className="space-y-2"><Label>Estágio</Label>
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
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Carregando...</div> : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {defaultStages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const stageTotal = getStageTotal(stage.id);
            return (
              <div key={stage.id} className="flex-shrink-0 w-80" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage.id)}>
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
                      <div key={deal.id} draggable onDragStart={(e) => handleDragStart(e, deal.id)} className="cursor-grab rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{deal.title}</h4>
                          <GripVertical className="h-4 w-4 text-gray-400" />
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
