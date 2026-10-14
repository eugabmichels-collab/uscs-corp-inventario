"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TablePagination,
  useTablePagination,
} from "@/components/table-pagination";
import { RecordActions, RecordDetails } from "@/components/record-details";
import { Topbar } from "@/components/topbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAdminAudit,
  type AdminAuditEntry,
} from "@/lib/field-inventory-service";
export default function AuditPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [audit, setAudit] = useState<AdminAuditEntry[]>([]);
  const [detail, setDetail] = useState<AdminAuditEntry | null>(null);
  const pagination = useTablePagination(audit);
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("uscs-session") || "null");
    if (session?.role !== "Administrador") {
      router.replace("/dashboard");
      return;
    }
    setAuthorized(true);
    setAudit(getAdminAudit());
  }, [router]);
  if (!authorized) return null;
  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Auditoria" },
        ]}
      />
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Auditoria</h1>
          <p className="text-muted-foreground">
            Ações administrativas registradas neste dispositivo.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Histórico de ações</CardTitle>
            <CardDescription>
              {audit.length} registros encontrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ação</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Data e hora</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.length ? (
                  pagination.items.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="max-w-72 font-medium">
                        <p className="truncate" title={entry.action}>
                          {entry.action.split(" · ")[0]}
                        </p>
                      </TableCell>
                      <TableCell className="max-w-56">
                        <p className="truncate">
                          {entry.actor?.name ||
                            entry.actor?.email ||
                            "Não informado"}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <RecordActions
                          label={entry.action}
                          onDetails={() => setDetail(entry)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhuma ação administrativa registrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination {...pagination} />
          </CardContent>
        </Card>
        <RecordDetails
          title="Detalhes da ação"
          description={detail ? "Informações do registro de auditoria." : ""}
          open={!!detail}
          onClose={() => setDetail(null)}
          fields={
            detail
              ? [
                  { label: "Registro", value: detail.id },
                  { label: "Ação completa", value: detail.action },
                  { label: "Responsável", value: detail.actor?.name },
                  { label: "E-mail", value: detail.actor?.email },
                  { label: "Perfil de acesso", value: detail.actor?.role },
                  {
                    label: "Data e hora",
                    value: new Date(detail.createdAt).toLocaleString("pt-BR"),
                  },
                ]
              : []
          }
        />
      </main>
    </>
  );
}
