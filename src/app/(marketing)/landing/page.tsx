import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg">
            G
          </div>
          <span className="text-xl font-bold">GestãoFácil</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button>Começar Grátis</Button>
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          CRM simples para
          <br />
          <span className="text-blue-600">negócios que crescem</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Gerencie seus contatos, negócios e pipeline de vendas em um só lugar.
          Comece gratuitamente e escale conforme cresce.
        </p>
        <div className="mt-10 flex items-center justify-center space-x-4">
          <Link href="/register">
            <Button size="lg" className="px-8">
              Criar Conta Grátis
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="px-8">
            Ver Demo
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Rápido e Simples</h3>
            <p className="mt-2 text-gray-600">
              Interface intuitiva que não precisa de treinamento. Comece a usar
              em minutos.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Multi-tenant</h3>
            <p className="mt-2 text-gray-600">
              Dados isolados e seguros por empresa. Cada tenant tem seu próprio
              espaço.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Seguro</h3>
            <p className="mt-2 text-gray-600">
              Seus dados protegidos com as melhores práticas de segurança.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Comece a gerenciar seus clientes hoje
          </h2>
          <p className="mt-4 text-gray-400">
            Plano gratuito disponível. Sem cartão de crédito.
          </p>
          <Link href="/register" className="mt-8 inline-block">
            <Button size="lg" className="px-8">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-gray-500">
          © 2026 GestãoFácil. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
