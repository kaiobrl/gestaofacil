"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-gray-900">Relatórios</h2><p className="text-gray-600">Análise de desempenho do seu CRM</p></div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center"><DollarSign className="mr-2 h-5 w-5" />Receita por Estágio</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Lead", value: "R$ 45.000", color: "bg-blue-500", width: "25%" },
                { stage: "Contato", value: "R$ 32.000", color: "bg-purple-500", width: "18%" },
                { stage: "Proposta", value: "R$ 58.000", color: "bg-yellow-500", width: "33%" },
                { stage: "Negociação", value: "R$ 42.000", color: "bg-orange-500", width: "24%" },
                { stage: "Fechado", value: "R$ 125.000", color: "bg-green-500", width: "71%" },
              ].map((item) => (
                <div key={item.stage} className="space-y-2">
                  <div className="flex justify-between text-sm"><span>{item.stage}</span><span className="font-medium">{item.value}</span></div>
                  <div className="h-2 rounded-full bg-gray-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} /></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5" />Taxa de Conversão</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center"><p className="text-4xl font-bold text-green-600">24%</p><p className="text-sm text-gray-500">Taxa de conversão geral</p></div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-blue-50 p-4"><p className="text-2xl font-bold text-blue-600">128</p><p className="text-xs text-gray-500">Leads este mês</p></div>
                <div className="rounded-lg bg-green-50 p-4"><p className="text-2xl font-bold text-green-600">31</p><p className="text-xs text-gray-500">Negócios fechados</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" />Performance da Equipe</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "João Silva", deals: 12, revenue: "R$ 85.000" },
                { name: "Maria Santos", deals: 9, revenue: "R$ 62.000" },
                { name: "Pedro Costa", deals: 7, revenue: "R$ 45.000" },
                { name: "Ana Oliveira", deals: 5, revenue: "R$ 32.000" },
              ].map((person, i) => (
                <div key={person.name} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">{i + 1}</span>
                    <div><p className="font-medium">{person.name}</p><p className="text-xs text-gray-500">{person.deals} negócios</p></div>
                  </div>
                  <p className="font-medium text-green-600">{person.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5" />Atividades por Tipo</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Ligações", count: 156, color: "bg-blue-500" },
                { type: "Emails", count: 234, color: "bg-purple-500" },
                { type: "Reuniões", count: 45, color: "bg-green-500" },
                { type: "Notas", count: 89, color: "bg-gray-500" },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><div className={`h-3 w-3 rounded-full ${item.color}`} /><span>{item.type}</span></div>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
