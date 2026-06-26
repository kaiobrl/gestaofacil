"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ReportData {
  summary: {
    totalDeals: number;
    totalValue: number;
    conversionRate: number;
    totalContacts: number;
    totalCompanies: number;
    totalActivities: number;
  };
  dealsByStage: { stage: string; count: number; value: number }[];
  activitiesByType: { type: string; count: number }[];
}

const stageLabels: Record<string, string> = {
  lead: "Lead",
  contato: "Contato",
  proposta: "Proposta",
  negociacao: "Negociação",
  fechado: "Fechado",
  perdido: "Perdido",
};

const stageColors: Record<string, string> = {
  lead: "bg-blue-500",
  contato: "bg-purple-500",
  proposta: "bg-yellow-500",
  negociacao: "bg-orange-500",
  fechado: "bg-green-500",
  perdido: "bg-red-500",
};

const activityLabels: Record<string, string> = {
  CALL: "Ligações",
  EMAIL: "Emails",
  MEETING: "Reuniões",
  NOTE: "Notas",
};

const activityColors: Record<string, string> = {
  CALL: "bg-blue-500",
  EMAIL: "bg-purple-500",
  MEETING: "bg-green-500",
  NOTE: "bg-gray-500",
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/reports");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Carregando...</div>;
  if (!data) return <div className="text-center py-12 text-gray-500">Erro ao carregar relatórios</div>;

  const maxValue = Math.max(...data.dealsByStage.map((s) => s.value), 1);

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-foreground md:text-2xl">Relatórios</h2><p className="text-muted-foreground">Análise de desempenho do seu CRM</p></div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center"><DollarSign className="mr-2 h-5 w-5" />Receita por Estágio</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.dealsByStage.map((item) => (
                <div key={item.stage} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{stageLabels[item.stage] || item.stage}</span>
                    <span className="font-medium">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${stageColors[item.stage] || "bg-gray-400"}`}
                      style={{ width: `${(item.value / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5" />Resumo Geral</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{data.summary.conversionRate}%</p>
                <p className="text-sm text-gray-500">Taxa de conversão</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-2xl font-bold text-blue-600">{data.summary.totalDeals}</p>
                  <p className="text-xs text-gray-500">Negócios totais</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(data.summary.totalValue)}</p>
                  <p className="text-xs text-gray-500">Valor total</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-2xl font-bold text-purple-600">{data.summary.totalContacts}</p>
                  <p className="text-xs text-gray-500">Contatos</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-4">
                  <p className="text-2xl font-bold text-orange-600">{data.summary.totalCompanies}</p>
                  <p className="text-xs text-gray-500">Empresas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5" />Atividades por Tipo</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.activitiesByType.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-3 w-3 rounded-full ${activityColors[item.type] || "bg-gray-400"}`} />
                    <span>{activityLabels[item.type] || item.type}</span>
                  </div>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" />Negócio por Estágio</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.dealsByStage.map((item) => (
                <div key={item.stage} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{stageLabels[item.stage] || item.stage}</p>
                    <p className="text-xs text-gray-500">{item.count} {item.count === 1 ? "negócio" : "negócios"}</p>
                  </div>
                  <p className="font-medium text-green-600">{formatCurrency(item.value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
