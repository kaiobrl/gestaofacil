"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Handshake, CheckSquare, DollarSign } from "lucide-react";

const stats = [
  { title: "Contatos", value: "1.234", change: "+12% este mês", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "Negócios Ativos", value: "48", change: "+8 esta semana", icon: Handshake, color: "text-purple-600", bg: "bg-purple-100" },
  { title: "Tarefas Pendentes", value: "23", change: "5 vencem hoje", icon: CheckSquare, color: "text-orange-600", bg: "bg-orange-100" },
  { title: "Receita Mensal", value: "R$ 125.400", change: "+18% vs mês anterior", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
];

const recentDeals = [
  { id: 1, title: "Projeto Website", value: "R$ 15.000", stage: "Proposta", contact: "João Silva" },
  { id: 2, title: "Consultoria ERP", value: "R$ 45.000", stage: "Negociação", contact: "Maria Santos" },
  { id: 3, title: "Licença Software", value: "R$ 8.500", stage: "Lead", contact: "Pedro Costa" },
  { id: 4, title: "Suporte Anual", value: "R$ 12.000", stage: "Contato", contact: "Ana Oliveira" },
  { id: 5, title: "Migração Cloud", value: "R$ 32.000", stage: "Fechado", contact: "Lucas Lima" },
];

const stageColors: Record<string, string> = {
  Lead: "bg-blue-100 text-blue-800",
  Contato: "bg-purple-100 text-purple-800",
  Proposta: "bg-yellow-100 text-yellow-800",
  Negociação: "bg-orange-100 text-orange-800",
  Fechado: "bg-green-100 text-green-800",
  Perdido: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral do seu CRM</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Negócios Recentes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-sm text-gray-500">{deal.contact}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{deal.value}</p>
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${stageColors[deal.stage] || "bg-gray-100 text-gray-800"}`}>{deal.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Atividades de Hoje</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "09:00", title: "Reunião com João Silva", type: "Reunião" },
                { time: "11:30", title: "Ligação para Maria Santos", type: "Ligação" },
                { time: "14:00", title: "Follow-up proposta Pedro", type: "Email" },
                { time: "16:00", title: "Demo para Ana Oliveira", type: "Reunião" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-mono text-gray-500">{activity.time}</div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
