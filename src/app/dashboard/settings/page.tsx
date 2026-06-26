"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Building2, User, Shield, Check } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [profileName, setProfileName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantPlan, setTenantPlan] = useState("FREE");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [tenantMsg, setTenantMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, tenantRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/tenant"),
        ]);
        const userData = await userRes.json();
        const tenantData = await tenantRes.json();
        if (userData) setProfileName(userData.name || "");
        if (tenantData) {
          setTenantName(tenantData.name || "");
          setTenantPlan(tenantData.plan || "FREE");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleProfileSave = async () => {
    setProfileMsg("");
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profileName }),
    });
    if (res.ok) {
      setProfileMsg("Perfil atualizado!");
      await update();
    } else {
      setProfileMsg("Erro ao atualizar perfil");
    }
    setTimeout(() => setProfileMsg(""), 3000);
  };

  const handleTenantSave = async () => {
    setTenantMsg("");
    const res = await fetch("/api/tenant", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tenantName }),
    });
    if (res.ok) {
      setTenantMsg("Empresa atualizada!");
    } else {
      setTenantMsg("Erro ao atualizar empresa");
    }
    setTimeout(() => setTenantMsg(""), 3000);
  };

  const handlePasswordChange = async () => {
    setPasswordMsg("");
    if (newPassword !== confirmPassword) {
      setPasswordMsg("As senhas não conferem");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg("A nova senha deve ter no mínimo 8 caracteres");
      return;
    }
    const res = await fetch("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setPasswordMsg("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMsg(data.error || "Erro ao alterar senha");
    }
    setTimeout(() => setPasswordMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-gray-900 md:text-2xl">Configurações</h2><p className="text-gray-600">Gerencie as configurações da sua conta</p></div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center text-lg"><User className="mr-2 h-5 w-5" />Perfil</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16"><AvatarFallback className="bg-blue-100 text-blue-600 text-lg">{getInitials(profileName || "U")}</AvatarFallback></Avatar>
            </div>
            <div className="space-y-2"><Label>Nome</Label><Input value={profileName} onChange={(e) => setProfileName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={session?.user?.email || ""} disabled /></div>
            {profileMsg && <p className="text-sm text-green-600 flex items-center"><Check className="mr-1 h-4 w-4" />{profileMsg}</p>}
            <Button onClick={handleProfileSave}>Salvar alterações</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center text-lg"><Building2 className="mr-2 h-5 w-5" />Empresa</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Nome da empresa</Label><Input value={tenantName} onChange={(e) => setTenantName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Plano atual</Label>
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">{tenantPlan}</span>
              </div>
            </div>
            {tenantMsg && <p className="text-sm text-green-600 flex items-center"><Check className="mr-1 h-4 w-4" />{tenantMsg}</p>}
            <Button onClick={handleTenantSave}>Salvar alterações</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center text-lg"><Shield className="mr-2 h-5 w-5" />Segurança</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Senha atual</Label><Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
            <div className="space-y-2"><Label>Nova senha</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
            <div className="space-y-2"><Label>Confirmar nova senha</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
            {passwordMsg && <p className={`text-sm flex items-center ${passwordMsg.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>{passwordMsg}</p>}
            <Button onClick={handlePasswordChange}>Alterar senha</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
