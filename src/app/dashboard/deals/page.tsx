"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, DollarSign, Handshake } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  status: string;
  probability: number;
  contact: { firstName: string; lastName: string | null } | null;
  company: { id: string; name: string } | null;
  owner: { name: string };
}

const stages = [
  { value: "lead", label: "Lead" },
  { value: "contato", label: "Contato" },
  { value: "proposta", label: "Proposta" },
  { value: "negociacao", label: "Negociação" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
];

const stageColors: Record<string, string> = {
  lead: "bg-blue-100 text-blue-800",
  contato: "bg-purple-100 text-purple-800",
  proposta: "bg-yellow-100 text-yellow-800",
  negociacao: "bg-orange-100 text-orange-800",
  fechado: "bg-green-100 text-green-800",
  perdido: "bg-red-100 text-red-800",
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", value: "", stage: "lead", probability: "0" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/deals");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        value: parseFloat(formData.value) || 0,
        stage: formData.stage,
        probability: parseInt(formData.probability) || 0,
      }),
    });
    if (res.ok) {
      setDialogOpen(false);
      setFormData({ title: "", value: "", stage: "lead", probability: "0" });
      refresh();
    }
  };

  const filteredDeals = deals.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Negócios"
        description="Gerencie seus negócios e oportunidades"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Novo Negócio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Negócio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Título *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Probabilidade %</Label>
                    <Input type="number" min="0" max="100" value={formData.probability} onChange={(e) => setFormData({ ...formData, probability: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Estágio</Label>
                  <Select value={formData.stage} onValueChange={(v) => setFormData({ ...formData, stage: v ?? "lead" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{stages.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
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
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Buscar negócios..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Negócio</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Estágio</TableHead>
              <TableHead>Probabilidade</TableHead>
              <TableHead>Responsável</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Carregando...</TableCell>
              </TableRow>
            ) : filteredDeals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={Handshake} title="Nenhum negócio encontrado" description="Adicione seu primeiro negócio" />
                </TableCell>
              </TableRow>
            ) : filteredDeals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Handshake className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{deal.title}</p>
                      {deal.company && <p className="text-xs text-gray-500">{deal.company.name}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center font-medium text-green-600">
                    <DollarSign className="h-4 w-4" />{formatCurrency(deal.value)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={stageColors[deal.stage] || ""}>
                    {stages.find((s) => s.value === deal.stage)?.label || deal.stage}
                  </Badge>
                </TableCell>
                <TableCell>{deal.probability}%</TableCell>
                <TableCell className="text-sm text-gray-600">{deal.owner.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
