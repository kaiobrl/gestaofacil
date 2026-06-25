"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Mail, Phone, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

interface Contact {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  companyId: string | null;
  jobTitle: string | null;
  company: { id: string; name: string } | null;
  tags: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", companyId: "", jobTitle: "" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        const res = await fetch(`/api/contacts?${params}`);
        const data = await res.json();
        setContacts(data.contacts || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setDialogOpen(false);
        setFormData({ firstName: "", lastName: "", email: "", phone: "", companyId: "", jobTitle: "" });
        refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contatos"
        description="Gerencie seus contatos"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Novo Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Contato</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome *</Label>
                    <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Sobrenome</Label>
                    <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} />
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
        <Input placeholder="Buscar contatos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contato</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Empresa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Carregando...</TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState icon={Users} title="Nenhum contato encontrado" description="Adicione seu primeiro contato" />
                </TableCell>
              </TableRow>
            ) : contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {getInitials(`${contact.firstName} ${contact.lastName || ""}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                      {contact.jobTitle && <p className="text-xs text-gray-500">{contact.jobTitle}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {contact.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="mr-2 h-4 w-4 text-gray-400" />{contact.email}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {contact.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />{contact.phone}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">{contact.company?.name || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
