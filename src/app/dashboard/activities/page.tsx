"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Check, Phone, Mail, Video, FileText, CheckSquare, Pencil, Trash2, Undo2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  completed: boolean;
  contact: { id: string; firstName: string; lastName: string | null } | null;
  deal: { id: string; title: string } | null;
}

interface ContactOption { id: string; firstName: string; lastName: string | null; }
interface DealOption { id: string; title: string; }

const activityTypes = [
  { value: "CALL", label: "Ligação", icon: Phone, color: "text-blue-600" },
  { value: "EMAIL", label: "Email", icon: Mail, color: "text-purple-600" },
  { value: "MEETING", label: "Reunião", icon: Video, color: "text-green-600" },
  { value: "NOTE", label: "Nota", icon: FileText, color: "text-gray-600" },
];

const emptyForm = { type: "CALL", title: "", description: "", dueDate: "", contactId: "", dealId: "" };

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [deals, setDeals] = useState<DealOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [actRes, contRes, dealRes] = await Promise.all([
          fetch("/api/activities"),
          fetch("/api/contacts?limit=100"),
          fetch("/api/deals"),
        ]);
        const actData = await actRes.json();
        const contData = await contRes.json();
        const dealData = await dealRes.json();
        setActivities(actData.activities || []);
        setContacts(contData.contacts || []);
        setDeals(dealData.deals || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setFormData({
      type: activity.type,
      title: activity.title,
      description: activity.description || "",
      dueDate: activity.dueDate ? activity.dueDate.slice(0, 16) : "",
      contactId: activity.contact?.id || "",
      dealId: activity.deal?.id || "",
    });
    setDialogOpen(true);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await fetch("/api/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    });
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta atividade?")) return;
    await fetch("/api/activities", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      type: formData.type,
      title: formData.title,
      description: formData.description || undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      contactId: formData.contactId || undefined,
      dealId: formData.dealId || undefined,
    };

    if (editingId) {
      await fetch("/api/activities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/activities", {
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

  const getTypeInfo = (type: string) => activityTypes.find((t) => t.value === type) || activityTypes[0];
  const pending = activities.filter((a) => !a.completed);
  const completed = activities.filter((a) => a.completed);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atividades"
        description="Gerencie suas tarefas e atividades"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button />}>
              <Plus className="mr-2 h-4 w-4" /> Nova Atividade
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Atividade" : "Nova Atividade"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v ?? "CALL" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{activityTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Título *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Data/Hora</Label>
                  <Input type="datetime-local" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Contato</Label>
                  <Select value={formData.contactId} onValueChange={(v) => setFormData({ ...formData, contactId: v ?? "" })}>
                    <SelectTrigger><SelectValue placeholder="Selecionar contato" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Negócio</Label>
                  <Select value={formData.dealId} onValueChange={(v) => setFormData({ ...formData, dealId: v ?? "" })}>
                    <SelectTrigger><SelectValue placeholder="Selecionar negócio" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {deals.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                      ))}
                    </SelectContent>
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
      ) : activities.length === 0 ? (
        <EmptyState icon={CheckSquare} title="Nenhuma atividade encontrada" description="Adicione sua primeira atividade" />
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pendentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pending.map((activity) => {
                  const info = getTypeInfo(activity.type);
                  const Icon = info.icon;
                  return (
                    <div key={activity.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-lg bg-gray-100 p-2">
                          <Icon className={`h-5 w-5 ${info.color}`} />
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            {activity.dueDate && <span>{formatDate(activity.dueDate)}</span>}
                            {activity.contact && <span>• {activity.contact.firstName} {activity.contact.lastName}</span>}
                            {activity.deal && <span>• {activity.deal.title}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleToggleComplete(activity.id, false)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(activity)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(activity.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
          {completed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-500">Concluídas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completed.map((activity) => {
                  const info = getTypeInfo(activity.type);
                  const Icon = info.icon;
                  return (
                    <div key={activity.id} className="flex items-center justify-between rounded-lg border p-4 bg-gray-50 opacity-60">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-lg bg-gray-200 p-2">
                          <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="font-medium line-through">{activity.title}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleToggleComplete(activity.id, true)}>
                          <Undo2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(activity.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
