"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Building2, Globe } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

interface Company {
  id: string;
  name: string;
  industry: string | null;
  size: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  _count: { deals: number; contacts: number };
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", industry: "", size: "", website: "", email: "", phone: "" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        const res = await fetch(`/api/companies?${params}`);
        const data = await res.json();
        setCompanies(data.companies || []);
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
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setDialogOpen(false);
        setFormData({ name: "", industry: "", size: "", website: "", email: "", phone: "" });
        refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Empresas"
        description="Gerencie suas empresas"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nova Empresa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Empresa</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Setor</Label>
                    <Input value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Porte</Label>
                    <Input value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
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
        <Input placeholder="Buscar empresas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Negócios</TableHead>
              <TableHead>Website</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Carregando...</TableCell>
              </TableRow>
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState icon={Building2} title="Nenhuma empresa encontrada" description="Adicione sua primeira empresa" />
                </TableCell>
              </TableRow>
            ) : companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <Building2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      {company.size && <p className="text-xs text-gray-500">{company.size}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{company.industry && <Badge variant="secondary">{company.industry}</Badge>}</TableCell>
                <TableCell className="text-sm">{company._count.deals}</TableCell>
                <TableCell>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                      <Globe className="mr-1 h-4 w-4" />Link
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
