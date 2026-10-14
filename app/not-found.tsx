"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, House, PackageSearch } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function NotFoundContent({ authenticated }: { authenticated: boolean }) {
  return (
    <main className="grid flex-1 place-items-center bg-background p-6">
      <section className="w-full max-w-lg rounded-xl border bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          USCS
        </div>
        <div className="relative mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PackageSearch className="size-9" />
          <span className="absolute -right-3 -top-2 rounded-md bg-primary px-2 py-1 text-sm font-bold text-primary-foreground">
            404
          </span>
        </div>
        <p className="text-sm font-medium text-primary">
          Página não encontrada
        </p>
        <h1 className="mt-2 text-2xl font-bold">
          Esta rota não existe no sistema
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {authenticated
            ? "O endereço pode estar incorreto, ter sido movido ou ainda não fazer parte do MVP de inventário."
            : "Você será redirecionado para a tela de acesso em instantes."}
        </p>
        {authenticated && (
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/dashboard">
                <House className="mr-2 size-4" />
                Ir para o Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/inventario">
                <ArrowLeft className="mr-2 size-4" />
                Abrir Inventário
              </Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function NotFound() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const isAuthenticated = Boolean(localStorage.getItem("uscs-session"));
    setAuthenticated(isAuthenticated);
    if (!isAuthenticated) {
      const timer = window.setTimeout(() => router.replace("/"), 2000);
      return () => window.clearTimeout(timer);
    }
  }, [router]);
  if (authenticated === null) return null;
  if (!authenticated) return <NotFoundContent authenticated={false} />;
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar
          breadcrumbs={[
            { label: "Sistema", href: "/dashboard" },
            { label: "Página não encontrada" },
          ]}
        />
        <NotFoundContent authenticated />
      </SidebarInset>
    </SidebarProvider>
  );
}
