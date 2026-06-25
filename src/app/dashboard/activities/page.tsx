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
import { Plus, Check, Phone, Mail, Video, FileText, CheckSquare } from "lucide-react";
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
  contact: { firstName: string; lastName: string | null } | null;
}

const activityTypes = [
  { value: "CALL", label: "Ligação", icon: Phone, color: "text-blue-600" },
  { value: "EMAIL", label: "Email", icon: Mail, color: "text-purple-600" },
  { value: "MEETING", label: "Reunião", icon: Video, color: "text-green-600" },
  { value: "NOTE", label: "Nota", icon: FileText, color: "text-gray-600" },
];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ type: "CALL", title: "", description: "", dueDate: "" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/activities");
        const data = await res.json();
        setActivities(data.activities || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleComplete = async (id: string) => {
    await fetch("/api/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: true }),
    });
    refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: formData.type,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || undefined,
      }),
    });
    if (res.ok) {
      setDialogOpen(false);
      setFormData({ type: "CALL", title: "", description: "", dueDate: "" });
      refresh();
    }
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
            <DialogTrigger>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nova Atividade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Atividade</DialogTitle>
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
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleComplete(activity.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
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
                      <Badge variant="secondary">Concluída</Badge>
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
