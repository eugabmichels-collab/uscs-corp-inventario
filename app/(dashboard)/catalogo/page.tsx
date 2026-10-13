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
import { Pencil } from "lucide-react";
import { RecordActions, RecordDetails } from "@/components/record-details";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCatalog, saveCatalog } from "@/lib/field-inventory-service";
import type { InventoryLab, KitCatalog } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(2, "Informe o código do kit."),
  name: z.string().min(3, "Informe o nome do kit."),
  lab: z.enum(["Fisica", "Robotica"]),
  area: z.string().min(2, "Informe a área."),
  expectedComponentCount: z.coerce.number().int().min(0),
  manufacturer: z.string().optional(),
  manual: z.string().optional(),
  description: z.string().optional(),
});
type CatalogForm = z.infer<typeof schema>;
const emptyCatalogForm: CatalogForm = {
  code: "",
  name: "",
  lab: "Fisica",
  area: "",
  expectedComponentCount: 0,
  manufacturer: "",
  manual: "",
  description: "",
};

export default function CatalogPage() {
  const [catalog, setCatalog] = useState<KitCatalog[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<KitCatalog | null>(null);
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CatalogForm>({
    resolver: zodResolver(schema),
    defaultValues: emptyCatalogForm,
  });
  useEffect(() => setCatalog(getCatalog()), []);
  const visible = useMemo(
    () =>
      catalog.filter(
        (kit) =>
          !kit.archived &&
          `${kit.code} ${kit.name} ${kit.area}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [catalog, search],
  );
  const [detail, setDetail] = useState<KitCatalog | null>(null);
  const pagination = useTablePagination(visible);
  const begin = (kit?: KitCatalog) => {
    setSubmitError("");
    setEditing(kit || null);
    reset(
      kit
        ? {
            code: kit.code,
            name: kit.name,
            lab: kit.lab,
            area: kit.area,
            expectedComponentCount: kit.expectedComponentCount,
            manufacturer: kit.manufacturer || "",
            manual: kit.manual || "",
            description: "",
          }
        : emptyCatalogForm,
    );
    setOpen(true);
  };
  const submit = (data: CatalogForm) => {
    if (!editing && catalog.some((kit) => kit.code === data.code)) {
      setSubmitError("Já existe um kit com este código.");
      return;
    }
    const nextKit: KitCatalog = {
      code: data.code,
      name: data.name,
      lab: data.lab as InventoryLab,
      area: data.area,
      expectedComponentCount: data.expectedComponentCount,
      manufacturer: data.manufacturer,
      manual: data.manual,
      components: editing?.components || [],
    };
    const next = editing
      ? catalog.map((kit) => (kit.code === editing.code ? nextKit : kit))
      : [...catalog, nextKit];
    saveCatalog(next);
    setCatalog(next);
    setEditing(null);
    reset(emptyCatalogForm);
    setOpen(false);
  };
  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Catálogo de Kits" },
        ]}
      />
      <main className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Catálogo de Kits</h1>
            <p className="text-muted-foreground">
              Crie e mantenha os kits disponíveis para o inventário.
            </p>
          </div>
          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) {
                setEditing(null);
                setSubmitError("");
                reset(emptyCatalogForm);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => begin()}>
                <Plus className="mr-2 size-4" />
                Novo kit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>{editing ? "Editar kit" : "Novo kit"}</DialogTitle>
                <DialogDescription>
                  As informações definem como o kit aparecerá no cadastro de
                  unidades.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit(submit)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Código" error={errors.code?.message}>
                    <Input
                      disabled={!!editing}
                      {...register("code")}
                      className={errors.code ? "border-destructive" : ""}
                    />
                  </Field>
                  <Field label="Nome do kit" error={errors.name?.message}>
                    <Input
                      {...register("name")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Laboratório">
                    <Controller
                      control={control}
                      name="lab"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fisica">Física</SelectItem>
                            <SelectItem value="Robotica">Robótica</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label="Área" error={errors.area?.message}>
                    <Input placeholder="Ex.: Mecânica" {...register("area")} />
                  </Field>
                </div>
                <Field label="Componentes previstos">
                  <Input
                    type="number"
                    min="0"
                    {...register("expectedComponentCount")}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Fabricante">
                    <Input {...register("manufacturer")} />
                  </Field>
                  <Field label="Manual">
                    <Input {...register("manual")} />
                  </Field>
                </div>
                <Field label="Descrição">
                  <Textarea {...register("description")} />
                </Field>
                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar kit</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Kits ativos</CardTitle>
              <CardDescription>
                {visible.length} registros encontrados.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  pagination.setPage(1);
                }}
                placeholder="Buscar código, nome ou área"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Kit</TableHead>
                  <TableHead>Laboratório</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.length ? (
                  pagination.items.map((kit) => (
                    <TableRow key={kit.code}>
                      <TableCell className="font-medium">{kit.code}</TableCell>
                      <TableCell className="max-w-72">
                        <p className="truncate" title={kit.name}>
                          {kit.name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {kit.lab === "Fisica" ? "Física" : "Robótica"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <RecordActions
                          label={kit.code}
                          onDetails={() => setDetail(kit)}
                          action={{
                            label: "Editar",
                            icon: Pencil,
                            onClick: () => begin(kit),
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
                      Nenhum kit encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination {...pagination} />
          </CardContent>
        </Card>
        <RecordDetails
          title="Detalhes do kit"
          description={detail ? detail.name : ""}
          open={!!detail}
          onClose={() => setDetail(null)}
          fields={
            detail
              ? [
                  { label: "Código", value: detail.code },
                  {
                    label: "Laboratório",
                    value: detail.lab === "Fisica" ? "Física" : "Robótica",
                  },
                  { label: "Área", value: detail.area },
                  { label: "Subárea", value: detail.subarea },
                  {
                    label: "Componentes previstos",
                    value: detail.expectedComponentCount,
                  },
                  {
                    label: "Composição cadastrada",
                    value: detail.components.length,
                  },
                  { label: "Fabricante", value: detail.manufacturer },
                  {
                    label: "Código do fabricante",
                    value: detail.manufacturerCode,
                  },
                  { label: "Manual", value: detail.manual },
                  {
                    label: "Componentes",
                    value: detail.components.length
                      ? detail.components
                          .map(
                            (c) =>
                              c.description +
                              " (" +
                              c.expectedQuantity +
                              " " +
                              c.unitOfMeasure +
                              ")",
                          )
                          .join("; ")
                      : "Composição ainda não cadastrada",
                  },
                ]
              : []
          }
        />
      </main>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
