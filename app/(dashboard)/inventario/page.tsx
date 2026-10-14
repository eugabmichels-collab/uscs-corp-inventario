"use client";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createUnit,
  exportUnits,
  getCatalog,
  getUnits,
  unitLabLabel,
} from "@/lib/field-inventory-service";
import type { InventoryLab, InventoryUnit, KitCatalog } from "@/lib/types";
import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  MapPin,
  PackagePlus,
  Save,
  Search,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const statusStyle: Record<string, string> = {
  "Nao conferido": "bg-muted text-muted-foreground",
  Completo: "bg-emerald-100 text-emerald-800",
  Incompleto: "bg-amber-100 text-amber-800",
  Danificado: "bg-red-100 text-red-800",
  Indisponivel: "bg-slate-200 text-slate-800",
};

const newUnitSchema = z.object({
  kitCode: z.string().min(1, "Selecione o kit do catálogo."),
  unitNumber: z.string().regex(/^\d{1,2}$/, "Informe um número entre 01 e 99."),
  address: z.string().trim().min(1, "Informe o endereço ou use [CONFERIR]."),
  patrimony: z.string().optional(),
  observations: z.string().optional(),
});

type NewUnitFormData = z.infer<typeof newUnitSchema>;

export default function InventoryPage() {
  const [units, setUnits] = useState<InventoryUnit[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => setUnits(getUnits()), []);
  const filtered = useMemo(
    () =>
      units.filter((unit) =>
        `${unit.id} ${unit.kitName} ${unit.address}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [units, search],
  );
  const [detail, setDetail] = useState<InventoryUnit | null>(null);
  const pagination = useTablePagination(filtered);
  const checked = units.filter(
    (unit) => unit.status !== "Nao conferido",
  ).length;
  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Inventário de campo" },
        ]}
      />
      <main className="flex-1 space-y-6 p-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Laboratórios de Física e Robótica
            </h1>
            <p className="text-muted-foreground">
              Uma unidade física por linha. Dados salvos neste dispositivo.
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:flex-wrap">
            <Button
              className="w-full md:w-auto"
              variant="outline"
              onClick={exportUnits}
            >
              <Download className="mr-2 size-4" />
              Exportar JSON
            </Button>
            <Button className="w-full md:w-auto" variant="outline" asChild>
              <Link href="/inventario/conferir">
                <ClipboardCheck className="mr-2 size-4" />
                Conferir
              </Link>
            </Button>
            <NewInventoryUnitDialog
              className="col-span-2 w-full md:col-span-1 md:w-auto"
              onCreated={(unit) => setUnits((current) => [...current, unit])}
            />
          </div>
        </section>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex gap-3 p-4 text-sm">
            <WifiOff className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <strong>Modo offline ativo.</strong> O cadastro é gravado
              imediatamente neste navegador. Exporte uma cópia ao fim de cada
              turno; a sincronização compartilhada entrará com o back-end.
            </div>
          </CardContent>
        </Card>
        <section className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Unidades cadastradas</CardDescription>
              <CardTitle className="text-3xl">{units.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Já conferidas</CardDescription>
              <CardTitle className="text-3xl">{checked}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={units.length ? (checked / units.length) * 100 : 0}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pendentes</CardDescription>
              <CardTitle className="text-3xl">
                {units.length - checked}
              </CardTitle>
            </CardHeader>
          </Card>
        </section>
        <Card>
          <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Unidades físicas</CardTitle>
              <CardDescription>
                {filtered.length} registros encontrados.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  pagination.setPage(1);
                }}
                placeholder="Código, kit ou endereço"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Kit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.length ? (
                  pagination.items.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.id}</TableCell>
                      <TableCell className="max-w-72">
                        <p className="truncate" title={unit.kitName}>
                          {unit.kitName}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusStyle[unit.status]}>
                          {unit.status === "Nao conferido"
                            ? "Não conferido"
                            : unit.status === "Indisponivel"
                              ? "Indisponível"
                              : unit.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <RecordActions
                          label={unit.id}
                          onDetails={() => setDetail(unit)}
                          action={{
                            label: "Conferir",
                            icon: ClipboardCheck,
                            href:
                              "/inventario/conferir?unidade=" +
                              encodeURIComponent(unit.id),
                          }}
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
                      Nenhuma unidade encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination {...pagination} />
          </CardContent>
        </Card>
        <RecordDetails
          title="Detalhes da unidade"
          description={detail ? detail.kitName : ""}
          open={!!detail}
          onClose={() => setDetail(null)}
          fields={
            detail
              ? [
                  { label: "Código", value: detail.id },
                  { label: "Status", value: detail.status },
                  { label: "Laboratório", value: unitLabLabel(detail.lab) },
                  { label: "Área", value: detail.area },
                  { label: "Localização", value: detail.address },
                  { label: "Patrimônio", value: detail.patrimony },
                  { label: "Fabricante", value: detail.manufacturer },
                  { label: "Manual", value: detail.manual },
                  { label: "Componentes", value: detail.components.length },
                  { label: "Conferido por", value: detail.verifiedBy },
                  {
                    label: "Última conferência",
                    value: detail.verifiedAt
                      ? new Date(detail.verifiedAt).toLocaleString("pt-BR")
                      : undefined,
                  },
                  { label: "Observações", value: detail.observations },
                ]
              : []
          }
        />
      </main>
    </>
  );
}

function NewInventoryUnitDialog({
  onCreated,
  className,
}: {
  onCreated: (unit: InventoryUnit) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [lab, setLab] = useState<InventoryLab>("Fisica");
  const [catalog, setCatalog] = useState<KitCatalog[]>([]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<NewUnitFormData>({
    resolver: zodResolver(newUnitSchema),
    defaultValues: {
      kitCode: "",
      unitNumber: "",
      address: "",
      patrimony: "",
      observations: "",
    },
  });
  useEffect(() => {
    if (open) setCatalog(getCatalog());
  }, [open]);
  const kits = useMemo(
    () => catalog.filter((kit) => kit.lab === lab && !kit.archived),
    [lab, catalog],
  );
  const selected = kits.find((kit) => kit.code === watch("kitCode"));
  const resetForm = () => {
    setLab("Fisica");
    reset();
  };
  const submit = (data: NewUnitFormData) => {
    const catalog = kits.find((kit) => kit.code === data.kitCode);
    if (!catalog) return;
    try {
      const unit = createUnit({
        catalog,
        unitNumber: data.unitNumber,
        address: data.address,
        patrimony: data.patrimony,
        observations: data.observations,
      });
      onCreated(unit);
      resetForm();
      setOpen(false);
    } catch (exception) {
      console.error(exception);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) resetForm();
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button className={className}>
          <PackagePlus className="mr-2 size-4" />
          Cadastrar unidade
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] min-w-0 max-w-[calc(100vw-2rem)] overflow-x-hidden sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar unidade</DialogTitle>
          <DialogDescription>
            Primeira passagem: registre uma unidade física a partir do catálogo.
          </DialogDescription>
        </DialogHeader>
        <form className="min-w-0 space-y-5" onSubmit={handleSubmit(submit)}>
          <Alert>
            <CheckCircle2 />
            <AlertTitle>Cadastro rápido</AlertTitle>
            <AlertDescription>
              Endereço não conhecido? Use <strong>[CONFERIR]</strong>
            </AlertDescription>
          </Alert>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <Label>Laboratório</Label>
              <Select
                value={lab}
                onValueChange={(value) => {
                  setLab(value as InventoryLab);
                  reset({
                    kitCode: "",
                    unitNumber: "",
                    address: "",
                    patrimony: "",
                    observations: "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fisica">Laboratório de Física</SelectItem>
                  <SelectItem value="Robotica">
                    Laboratório de Robótica
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 space-y-2">
              <Label>Kit do catálogo</Label>
              <Controller
                control={control}
                name="kitCode"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={
                        errors.kitCode
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent
                      position="item-aligned"
                      className="w-[calc(100vw-3rem)] max-w-[calc(100vw-3rem)] sm:w-auto sm:max-w-[500px]"
                    >
                      {kits.map((kit) => (
                        <SelectItem
                          key={kit.code}
                          value={kit.code}
                          className="whitespace-normal break-words py-2 leading-5"
                        >
                          {kit.code} — {kit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.kitCode && (
                <p className="text-sm text-destructive">
                  {errors.kitCode.message}
                </p>
              )}
            </div>
          </div>
          {selected && (
            <div className="min-w-0 overflow-hidden rounded-lg bg-muted p-3 text-sm">
              <strong className="block break-words">{selected.name}</strong>
              <br />
              <span className="block break-words text-muted-foreground">
                {unitLabLabel(selected.lab)} · {selected.area} ·{" "}
                {selected.expectedComponentCount} componentes previstos
              </span>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unit-number">Nº da unidade *</Label>
              <Input
                id="unit-number"
                className={
                  errors.unitNumber
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                {...register("unitNumber", {
                  onChange: (event) =>
                    (event.target.value = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 2)),
                })}
              />
              {errors.unitNumber && (
                <p className="text-sm text-destructive">
                  {errors.unitNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="patrimony">Patrimônio</Label>
              <Input id="patrimony" {...register("patrimony")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                id="address"
                className={`pl-9 ${errors.address ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("address")}
                placeholder="F03-P2 ou [CONFERIR]"
              />
            </div>
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="inventory-notes">Observações</Label>
            <Textarea id="inventory-notes" {...register("observations")} />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 size-4" />
              Criar unidade
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
