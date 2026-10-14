"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Download,
  Package,
  PackagePlus,
  WifiOff,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { exportUnits, getUnits } from "@/lib/field-inventory-service";
import type { InventoryUnit } from "@/lib/types";

export default function DashboardPage() {
  const [units, setUnits] = useState<InventoryUnit[]>([]);

  useEffect(() => setUnits(getUnits()), []);

  const summary = useMemo(
    () => ({
      total: units.length,
      checked: units.filter((unit) => unit.status !== "Nao conferido").length,
      physics: units.filter((unit) => unit.lab === "Fisica").length,
      robotics: units.filter((unit) => unit.lab === "Robotica").length,
    }),
    [units],
  );

  const progress = summary.total
    ? Math.round((summary.checked / summary.total) * 100)
    : 0;

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Dashboard" },
        ]}
      />
      <main className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Inventário de campo
            </h1>
            <p className="text-muted-foreground">
              Acompanhe o cadastro e a conferência dos laboratórios.
            </p>
          </div>
          <div className="grid w-full gap-2 md:flex md:w-auto">
            <Button
              className="w-full md:w-auto"
              variant="outline"
              onClick={exportUnits}
            >
              <Download className="mr-2 size-4" />
              Exportar backup
            </Button>
            <Button className="w-full md:w-auto" asChild>
              <Link href="/inventario">
                <PackagePlus className="mr-2 size-4" />
                Cadastrar unidade
              </Link>
            </Button>
          </div>
        </div>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex gap-3 p-4 text-sm">
            <WifiOff className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <strong>Modo offline.</strong> Os registros ficam neste
              dispositivo. Exporte o backup ao fim do turno de inventário.
            </div>
          </CardContent>
        </Card>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Unidades cadastradas"
            value={summary.total}
            icon={Package}
          />
          <Metric
            label="Já conferidas"
            value={summary.checked}
            icon={ClipboardCheck}
          />
          <Metric
            label="Laboratório de Física"
            value={summary.physics}
            icon={Package}
          />
          <Metric
            label="Laboratório de Robótica"
            value={summary.robotics}
            icon={Package}
          />
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Progresso da conferência</CardTitle>
            <CardDescription>
              {summary.checked} de {summary.total} unidades passaram pela
              conferência.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={progress} />
            <p className="text-sm font-medium">{progress}% concluído</p>
            <Button className="w-full md:w-auto" variant="outline" asChild>
              <Link href="/inventario">
                <ClipboardCheck className="mr-2 size-4" />
                Abrir inventário
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Package;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription>{label}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
