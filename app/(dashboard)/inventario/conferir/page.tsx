"use client";
import { Topbar } from "@/components/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUnit, updateUnit } from "@/lib/field-inventory-service";
import type {
  ComponentStatus,
  InventoryUnit,
  UnitInventoryStatus,
} from "@/lib/types";
import { ArrowLeft, CheckCircle2, ClipboardCheck, Save } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const statuses: ComponentStatus[] = ["OK", "Falta", "Danificado"];
function CheckUnitPage() {
  const params = useSearchParams();
  const selectedId = params.get("unidade") || "";
  const [query, setQuery] = useState(selectedId);
  const [unit, setUnit] = useState<InventoryUnit | undefined>();
  const [message, setMessage] = useState("");
  const [searched, setSearched] = useState(!!selectedId);
  const components =
    unit?.components
      .map((component, index) => ({ component, index }))
      .filter(({ component }) => component.requirement !== "Nao fornecido") ??
    [];
  const checked = components.filter(
    ({ component }) => component.status !== "Nao conferido",
  ).length;
  useEffect(() => {
    setQuery(selectedId);
    setUnit(selectedId ? getUnit(selectedId) : undefined);
    setSearched(!!selectedId);
    setMessage("");
  }, [selectedId]);
  const load = () => {
    setUnit(getUnit(query.trim()));
    setSearched(true);
    setMessage("");
  };
  const changeComponent = (index: number, status: ComponentStatus) => {
    if (!unit) return;
    setMessage("");
    const components = unit.components.map((component, i) =>
      i === index
        ? {
          ...component,
          status,
          foundQuantity:
            status === "OK"
              ? component.expectedQuantity
              : component.foundQuantity,
        }
        : component,
    );
    setUnit({ ...unit, components });
  };
  const save = () => {
    if (!unit) return;
    const relevant = unit.components.filter(
      (component) => component.requirement !== "Nao fornecido",
    );
    const hasDamage = relevant.some(
      (component) => component.status === "Danificado",
    );
    const incomplete = relevant.some(
      (component) =>
        component.status === "Falta" || component.status === "Nao conferido",
    );
    const status: UnitInventoryStatus = hasDamage
      ? "Danificado"
      : incomplete
        ? "Incompleto"
        : "Completo";
    const updated = {
      ...unit,
      status,
      verifiedAt: new Date().toISOString(),
      verifiedBy: "Administrador",
    };
    updateUnit(updated);
    setUnit(updated);
    setMessage("Conferência salva neste dispositivo.");
  };
  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Inventário de campo", href: "/inventario" },
          { label: "Conferência" },
        ]}
      />
      <main className="flex-1 min-w-0 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Conferir unidade</h1>
            <p className="text-muted-foreground">
              Localize a unidade e confira os componentes do kit.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/inventario">
              <ArrowLeft className="mr-2 size-4" />
              Voltar ao inventário
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Localizar unidade</CardTitle>
            <CardDescription>
              Informe o código ou abra uma unidade pela lista de inventário.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={(event) => {
                event.preventDefault();
                load();
              }}
            >
              <div className="w-full space-y-2 sm:max-w-md">
                <Label htmlFor="unit-code">Código da unidade</Label>
                <Input
                  id="unit-code"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ex.: 62001101-U01"
                />
              </div>
              <Button type="submit" disabled={!query.trim()}>
                Abrir unidade
              </Button>
            </form>
          </CardContent>
        </Card>
        {!unit && searched && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Unidade não encontrada neste dispositivo.
            </CardContent>
          </Card>
        )}
        {unit && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="break-words">{unit.kitName}</CardTitle>
                  <CardDescription>{unit.id}</CardDescription>
                </div>
                <Badge className="w-fit">
                  {unit.status === "Nao conferido"
                    ? "Não conferido"
                    : unit.status === "Indisponivel"
                      ? "Indisponível"
                      : unit.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-4 rounded-lg bg-muted/40 p-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted-foreground">Localização</dt>
                  <dd className="mt-1 text-sm break-words">{unit.address}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Patrimônio</dt>
                  <dd className="mt-1 text-sm">
                    {unit.patrimony || "Sem etiqueta"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Laboratório</dt>
                  <dd className="mt-1 text-sm">
                    {unit.lab === "Fisica" ? "Física" : "Robótica"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Área</dt>
                  <dd className="mt-1 text-sm">{unit.area}</dd>
                </div>
              </dl>
              {components.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold">Componentes do kit</h2>
                    <span className="text-sm text-muted-foreground">
                      {checked} de {components.length} conferidos
                    </span>
                  </div>
                  <Progress
                    value={(checked / components.length) * 100}
                    aria-label="Progresso da conferência"
                  />
                </div>
              )}
              {components.length === 0 ? (
                <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    Composição ainda não importada.
                  </strong>
                  <br />
                  Adicione a composição do kit ao catálogo para conferir esta
                  unidade.
                </div>
              ) : (
                <div className="grid gap-3 xl:grid-cols-2">
                  {components.map(({ component, index }) => (
                    <div
                      key={`${component.item}-${index}`}
                      className="rounded-lg border p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <strong className="text-sm break-words">
                            {component.item} · {component.description}
                          </strong>
                          <p className="text-xs text-muted-foreground">
                            Esperado: {component.expectedQuantity}{" "}
                            {component.unitOfMeasure} · {component.requirement}
                          </p>
                        </div>
                        <Select
                          value={
                            component.status === "Nao conferido"
                              ? undefined
                              : component.status
                          }
                          onValueChange={(value) =>
                            changeComponent(index, value as ComponentStatus)
                          }
                        >
                          <SelectTrigger
                            className="w-full shrink-0 sm:w-36"
                            aria-label={`Status de ${component.description}`}
                          >
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Ao salvar, data e responsável são preenchidos automaticamente.
                </p>
                <Button onClick={save} disabled={components.length === 0}>
                  <Save className="mr-2 size-4" />
                  Salvar conferência
                </Button>
              </div>
              {message && (
                <p
                  role="status"
                  className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCircle2 className="size-4" />
                  {message}
                </p>
              )}
            </CardContent>
          </Card>
        )}
        {!unit && !searched && (
          <Card>
            <CardContent className="flex gap-3 p-6 text-sm text-muted-foreground">
              <ClipboardCheck className="size-5" />
              Digite o código da unidade ou abra a conferência pela lista de
              inventário.
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}

export default function CheckUnitPageWithSuspense() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 p-6 text-sm text-muted-foreground">
          Carregando conferência…
        </main>
      }
    >
      <CheckUnitPage />
    </Suspense>
  );
}
