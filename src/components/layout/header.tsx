"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { getInitials } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-gray-800">
          {session?.user?.tenantSlug
            ? "Painel de Controle"
            : "GestãoFácil"}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-10 w-10 rounded-full cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getInitials(session?.user?.name || "U")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = "/dashboard/settings"}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
