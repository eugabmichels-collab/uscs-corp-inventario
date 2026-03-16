"use client"

import { useMemo, useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { toast } from "sonner"
import {
  FlaskConical,
  Package,
  Wrench,
  AlertTriangle,
  Eye,
  ArrowUpRight,
  Map,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockItems, mockMaintenances, mockLoans } from "@/lib/mock-data"
import { Separator } from "@/components/ui/separator"
import { getLabMapByLab, saveLabMap } from "@/lib/lab-map-service"
import type { LabMap } from "@/lib/types"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

const LabMapViewer = dynamic(() => import("@/components/lab-map-viewer").then((m) => m.LabMapViewer), { ssr: false })
const LabMapEditor = dynamic(() => import("@/components/lab-map-editor").then((m) => m.LabMapEditor), { ssr: false })

function getStatusBadge(status: string) {
  switch (status) {
    case "Em uso":
      return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">Em uso</Badge>
    case "Emprestado":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Emprestado</Badge>
    case "Em manutenção":
      return <Badge className="bg-info/15 text-info border-info/30 hover:bg-info/20">Em manutenção</Badge>
    case "Reserva":
      return <Badge variant="secondary">Reserva</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getConservationBadge(state: string) {
  switch (state) {
    case "Ótimo":
      return <Badge className="bg-success/15 text-success border-success/30">Ótimo</Badge>
    case "Bom":
      return <Badge className="bg-success/15 text-success border-success/30">Bom</Badge>
    case "Regular":
      return <Badge className="bg-warning/15 text-warning border-warning/30">Regular</Badge>
    case "Ruim":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30">Ruim</Badge>
    default:
      return <Badge variant="outline">{state}</Badge>
  }
}

const LAB_NAME = "Laboratório de Física" as const

export default function LabFisicaPage() {
  const labItems = useMemo(() => mockItems.filter((i) => i.laboratory === LAB_NAME), [])
  const labMaintenances = useMemo(() => mockMaintenances.filter((m) => m.itemCode.startsWith("LAB-FIS")), [])
  const labLoans = useMemo(() => mockLoans.filter((l) => l.originLab === LAB_NAME), [])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(labItems.length / itemsPerPage)
  const paginatedItems = labItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const [labMap, setLabMap] = useState<LabMap | undefined>(undefined)
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    setLabMap(getLabMapByLab(LAB_NAME))
  }, [])

  const handleSaveMap = useCallback((map: LabMap) => {
    const saved = saveLabMap({ ...map, laboratory: LAB_NAME })
    setLabMap(saved)
    setMapKey((k) => k + 1)
    toast.success("Planta salva com sucesso!", {
      description: `${saved.elements.length} elemento(s) • Atualizado em ${new Date(saved.updatedAt).toLocaleString("pt-BR")}`,
    })
  }, [])

  const stats = useMemo(() => ({
    total: labItems.length,
    inUse: labItems.filter((i) => i.usageStatus === "Em uso").length,
    inMaintenance: labItems.filter((i) => i.usageStatus === "Em manutenção").length,
    critical: labItems.filter((i) => i.criticality === "Alta" || i.criticality === "Crítica").length,
  }), [labItems])

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    labItems.forEach((item) => {
      const short = item.category.replace("Equipamento de ", "").replace("Ferramenta ", "")
      counts[short] = (counts[short] || 0) + 1
    })
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      fill: `var(--color-chart-${(i % 5) + 1})`,
    }))
  }, [labItems])

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Laboratórios" },
          { label: "Física" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Laboratório de Física</h1>
            <p className="text-muted-foreground">
              Visão geral dos equipamentos e atividades do laboratório
            </p>
          </div>
          <Button asChild>
            <Link href="/inventario?lab=fisica">
              <Package className="mr-2 size-4" />
              Ver Inventário Completo
            </Link>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Cadastrados neste lab</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Em Uso</CardTitle>
              <FlaskConical className="size-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inUse}</div>
              <p className="text-xs text-muted-foreground">Ativos em operação</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
              <Wrench className="size-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inMaintenance}</div>
              <p className="text-xs text-muted-foreground">Em reparo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alta Criticidade</CardTitle>
              <AlertTriangle className="size-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.critical}</div>
              <p className="text-xs text-muted-foreground">Itens críticos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category chart */}
          <Card>
            <CardHeader>
              <CardTitle>Itens por Categoria</CardTitle>
              <CardDescription>Distribuição dos equipamentos do laboratório</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="text-sm font-medium">{payload[0].payload.name}</div>
                            <div className="text-sm text-muted-foreground">{payload[0].value} item(ns)</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Responsible overview */}
          <Card>
            <CardHeader>
              <CardTitle>Responsáveis</CardTitle>
              <CardDescription>Distribuição de itens por responsável</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  labItems.reduce<Record<string, number>>((acc, item) => {
                    acc[item.responsible] = (acc[item.responsible] || 0) + 1
                    return acc
                  }, {})
                ).map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm">{name}</span>
                    <Badge variant="secondary">{count} ite{count > 1 ? "ns" : "m"}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lab Map */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Map className="size-5" />
                  Planta do Laboratório
                </CardTitle>
                <CardDescription>
                  Visualize a disposição dos equipamentos no laboratório. Clique em um equipamento para ver detalhes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="view">
              <TabsList>
                <TabsTrigger value="view">Visualizar</TabsTrigger>
                <TabsTrigger value="edit">Editar Planta</TabsTrigger>
              </TabsList>
              <TabsContent value="view" className="mt-4">
                {labMap ? (
                  <LabMapViewer key={`view-${mapKey}`} map={labMap} />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">Nenhuma planta cadastrada para este laboratório.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="edit" className="mt-4">
                <LabMapEditor
                  key={`edit-${mapKey}`}
                  initialMap={labMap}
                  onSave={handleSaveMap}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Items table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Equipamentos do Laboratório</CardTitle>
                <CardDescription>{labItems.length} item(ns) cadastrado(s)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Conservação</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Nenhum equipamento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.internalCode}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.category}</TableCell>
                    <TableCell className="text-sm">{item.location}</TableCell>
                    <TableCell>{getConservationBadge(item.conservationState)}</TableCell>
                    <TableCell>{getStatusBadge(item.usageStatus)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-8" asChild>
                        <Link href={`/inventario/${item.id}`}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
            </div>

            {totalPages > 1 && (
              <>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                    {Math.min(currentPage * itemsPerPage, labItems.length)} de{" "}
                    {labItems.length} registro(s)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm">
                      {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
