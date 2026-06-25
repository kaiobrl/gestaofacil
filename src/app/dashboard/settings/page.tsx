"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Building2, User, Shield } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-gray-900">Configurações</h2><p className="text-gray-600">Gerencie as configurações da sua conta</p></div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center text-lg"><User className="mr-2 h-5 w-5" />Perfil</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16"><AvatarFallback className="bg-blue-100 text-blue-600 text-lg">{getInitials(session?.user?.name || "U")}</AvatarFallback></Avatar>
              <Button variant="outline" size="sm">Alterar foto</Button>
            </div>
            <div className="space-y-2"><Label>Nome</Label><Input defaultValue={session?.user?.name || ""} /></div>
            <div className="space-y-2"><Label>Email</Label><Input defaultValue={session?.user?.email || ""} disabled /></div>
            <Button>Salvar alterações</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center text-lg"><Building2 className="mr-2 h-5 w-5" />Empresa</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Nome da empresa</Label><Input defaultValue="Minha Empresa" /></div>
            <div className="space-y-2"><Label>Plano atual</Label>
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">Starter</span>
                <Button variant="link" size="sm">Upgrade</Button>
              </div>
            </div>
            <Button>Salvar alterações</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center text-lg"><Shield className="mr-2 h-5 w-5" />Segurança</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Senha atual</Label><Input type="password" placeholder="••••••••" /></div>
            <div className="space-y-2"><Label>Nova senha</Label><Input type="password" placeholder="••••••••" /></div>
            <div className="space-y-2"><Label>Confirmar nova senha</Label><Input type="password" placeholder="••••••••" /></div>
            <Button>Alterar senha</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
