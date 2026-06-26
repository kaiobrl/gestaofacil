"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Mail, Phone, Users, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { MobileTableCard } from "@/components/mobile-table-card";

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

interface CompanyOption {
  id: string;
  name: string;
}

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", companyId: "", jobTitle: "" };

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        const [contactsRes, companiesRes] = await Promise.all([
          fetch(`/api/contacts?${params}`),
          fetch("/api/companies?limit=100"),
        ]);
        const contactsData = await contactsRes.json();
        const companiesData = await companiesRes.json();
        setContacts(contactsData.contacts || []);
        setCompanies(companiesData.companies || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName || "",
      email: contact.email || "",
      phone: contact.phone || "",
      companyId: contact.companyId || "",
      jobTitle: contact.jobTitle || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este contato?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/contacts/${editingId}` : "/api/contacts";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setDialogOpen(false);
      setFormData(emptyForm);
      setEditingId(null);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contatos"
        description="Gerencie seus contatos"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button />}>
              <Plus className="mr-2 h-4 w-4" /> Novo Contato
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Contato" : "Novo Contato"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Select value={formData.companyId} onValueChange={(v) => setFormData({ ...formData, companyId: v ?? "" })}>
                    <SelectTrigger><SelectValue placeholder="Selecionar empresa" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
      {loading ? (
        <div className="text-center py-8 text-gray-500 md:hidden">Carregando...</div>
      ) : contacts.length === 0 ? (
        <div className="md:hidden">
          <EmptyState icon={Users} title="Nenhum contato encontrado" description="Adicione seu primeiro contato" />
        </div>
      ) : (
        <div className="space-y-3 md:hidden">
          {contacts.map((contact) => (
            <MobileTableCard
              key={contact.id}
              title={`${contact.firstName} ${contact.lastName || ""}`}
              subtitle={contact.jobTitle || undefined}
              fields={[
                ...(contact.email ? [{ icon: Mail, label: "Email", value: contact.email }] : []),
                ...(contact.phone ? [{ icon: Phone, label: "Telefone", value: contact.phone }] : []),
                ...(contact.company ? [{ label: "Empresa", value: contact.company.name }] : []),
              ]}
              actions={[
                { icon: Pencil, label: "Editar", onClick: () => openEdit(contact) },
                { icon: Trash2, label: "Excluir", onClick: () => handleDelete(contact.id), variant: "destructive" },
              ]}
            />
          ))}
        </div>
      )}
      <div className="hidden rounded-lg border bg-white md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contato</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Carregando...</TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
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
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(contact)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
