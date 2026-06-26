"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="md:pl-64">
          <Header onMenuToggle={() => setSidebarOpen(true)} />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
