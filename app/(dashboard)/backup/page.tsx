"use client";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadDemoData, removeDemoData } from "@/lib/demo-data";
import { addAudit, exportUnits, getUnits } from "@/lib/field-inventory-service";
import { Download, FileUp, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function BackupPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [count, setCount] = useState(0);
  const [demoMessage, setDemoMessage] = useState("");
  const manageDemo = (remove: boolean) => {
    try {
      if (remove) removeDemoData();
      else loadDemoData();
      setCount(getUnits().length);
      setDemoMessage(
        remove
          ? "Dados de demonstração removidos. Seus demais registros foram preservados."
          : "Demonstração carregada. Abra Inventário, Equipe, Catálogo ou Auditoria para testar os dados.",
      );
    } catch {
      setDemoMessage(
        "Não foi possível atualizar a demonstração. Verifique os dados locais e o espaço disponível no navegador.",
      );
    }
  };
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("uscs-session") || "null");
    if (session?.role !== "Administrador") {
      router.replace("/dashboard");
      return;
    }
    setAuthorized(true);
    setCount(getUnits().length);
  }, [router]);
  const restore = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        JSON.parse(String(reader.result));
        localStorage.setItem(
          "uscs-field-inventory-units-v1",
          String(reader.result),
        );
        addAudit("Backup de inventário importado");
        setCount(getUnits().length);
        alert("Backup importado com sucesso.");
      } catch {
        alert("Arquivo JSON inválido.");
      }
    };
    reader.readAsText(file);
  };
  if (!authorized) return null;
  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Backup e dados" },
        ]}
      />
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Backup e dados</h1>
          <p className="text-muted-foreground">
            Proteja os registros locais do inventário de campo.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{count} unidades no dispositivo</CardTitle>
            <CardDescription>
              Exporte uma cópia no fim de cada turno de inventário.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <div className="grid w-full gap-2 md:flex md:w-auto">
              <Button variant="outline" asChild>
                <label>
                  <FileUp className="mr-2 size-4" />
                  Importar backup
                  <input
                    className="hidden"
                    type="file"
                    accept="application/json"
                    onChange={restore}
                  />
                </label>
              </Button>
              <Button
                onClick={() => {
                  exportUnits();
                  addAudit("Backup do inventário exportado");
                }}
              >
                <Download className="mr-2 size-4" />
                Exportar JSON
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dados de demonstração</CardTitle>
            <CardDescription>
              Teste a usabilidade com 24 kits, 240 unidades físicas, 48 membros
              e 120 registros de auditoria fictícios. Inclui componentes,
              endereços, pendências e diferentes estados de conferência e
              acesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Os exemplos são adicionados aos dados existentes neste navegador.
              Carregar novamente não duplica os registros. Nenhum convite real
              será enviado.
            </p>
            <div className="grid w-full gap-2 md:flex md:w-auto">
              <Button variant="outline" onClick={() => manageDemo(true)}>
                Remover demonstração
              </Button>
              <Button onClick={() => manageDemo(false)}>
                Carregar demonstração
              </Button>
            </div>
            {demoMessage && (
              <p role="status" className="text-sm">
                {demoMessage}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex gap-3 p-4 text-sm">
            <ShieldCheck className="size-5 text-primary" />A importação
            substitui os registros locais deste navegador. Exporte o estado
            atual antes de restaurar um arquivo.
          </CardContent>
        </Card>
      </main>
    </>
  );
}
