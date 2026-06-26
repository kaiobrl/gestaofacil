"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Handshake, CheckSquare, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  contacts: number;
  deals: number;
  pendingTasks: number;
  revenue: number;
}

interface RecentDeal {
  id: string;
  title: string;
  value: number;
  stage: string;
  contact: { firstName: string; lastName: string | null } | null;
}

const stageColors: Record<string, string> = {
  lead: "bg-blue-100 text-blue-800",
  contato: "bg-purple-100 text-purple-800",
  proposta: "bg-yellow-100 text-yellow-800",
  negociacao: "bg-orange-100 text-orange-800",
  fechado: "bg-green-100 text-green-800",
  perdido: "bg-red-100 text-red-800",
};

const stageLabels: Record<string, string> = {
  lead: "Lead",
  contato: "Contato",
  proposta: "Proposta",
  negociacao: "Negociação",
  fechado: "Fechado",
  perdido: "Perdido",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ contacts: 0, deals: 0, pendingTasks: 0, revenue: 0 });
  const [recentDeals, setRecentDeals] = useState<RecentDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [contactsRes, dealsRes, activitiesRes] = await Promise.all([
          fetch("/api/contacts?limit=1"),
          fetch("/api/deals?status=OPEN"),
          fetch("/api/activities?status=pending"),
        ]);

        const contactsData = await contactsRes.json();
        const dealsData = await dealsRes.json();
        const activitiesData = await activitiesRes.json();

        setStats({
          contacts: contactsData.pagination?.total || 0,
          deals: dealsData.deals?.length || 0,
          pendingTasks: activitiesData.activities?.length || 0,
          revenue: dealsData.deals?.reduce((sum: number, deal: RecentDeal) => sum + deal.value, 0) || 0,
        });

        setRecentDeals(dealsData.deals?.slice(0, 5) || []);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    { title: "Contatos", value: stats.contacts, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Negócios Ativos", value: stats.deals, icon: Handshake, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Tarefas Pendentes", value: stats.pendingTasks, icon: CheckSquare, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Receita Total", value: formatCurrency(stats.revenue), icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground md:text-2xl">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do seu CRM</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Negócios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Carregando...</div>
          ) : recentDeals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum negócio encontrado</div>
          ) : (
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-sm text-gray-500">
                      {deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName || ""}` : "Sem contato"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(deal.value)}</p>
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${stageColors[deal.stage] || "bg-gray-100 text-gray-800"}`}>
                      {stageLabels[deal.stage] || deal.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
