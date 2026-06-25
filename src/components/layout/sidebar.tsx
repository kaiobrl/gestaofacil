"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  GitBranch,
  Handshake,
  CheckSquare,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Contatos", href: "/dashboard/contacts", icon: Users },
  { name: "Empresas", href: "/dashboard/companies", icon: Building2 },
  { name: "Pipeline", href: "/dashboard/pipeline", icon: GitBranch },
  { name: "Negócios", href: "/dashboard/deals", icon: Handshake },
  { name: "Atividades", href: "/dashboard/activities", icon: CheckSquare },
  { name: "Relatórios", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            G
          </div>
          <span className="text-xl font-bold">GestãoFácil</span>
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
