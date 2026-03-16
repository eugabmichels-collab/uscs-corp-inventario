"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Package,
} from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { mockMaintenances } from "@/lib/mock-data"

function getStatusBadge(status: string) {
  switch (status) {
    case "Aberta":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Aberta</Badge>
    case "Em andamento":
      return <Badge className="bg-info/15 text-info border-info/30 hover:bg-info/20">Em andamento</Badge>
    case "Concluída":
      return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">Concluída</Badge>
    case "Aguardando peça":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Aguardando peça</Badge>
    case "Terceirizada":
      return <Badge variant="secondary">Terceirizada</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getCriticalityBadge(criticality: string) {
  switch (criticality) {
    case "Crítica":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30">Crítica</Badge>
    case "Alta":
      return <Badge className="bg-warning/15 text-warning border-warning/30">Alta</Badge>
    case "Média":
      return <Badge className="bg-info/15 text-info border-info/30">Média</Badge>
    case "Baixa":
      return <Badge variant="secondary">Baixa</Badge>
    default:
      return <Badge variant="outline">{criticality}</Badge>
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case "Corretiva":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30">Corretiva</Badge>
    case "Preventiva":
      return <Badge className="bg-info/15 text-info border-info/30">Preventiva</Badge>
    case "Calibração":
      return <Badge className="bg-warning/15 text-warning border-warning/30">Calibração</Badge>
    case "Inspeção":
      return <Badge variant="secondary">Inspeção</Badge>
    case "Avaliação técnica":
      return <Badge variant="outline">Avaliação técnica</Badge>
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR")
}

interface Filters {
  search: string
  status: string
  type: string
  criticality: string
}

const initialFilters: Filters = {
  search: "",
  status: "",
  type: "",
  criticality: "",
}

export default function ManutencaoPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredMaintenances = useMemo(() => {
    let result = [...mockMaintenances]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (m) =>
          m.itemName.toLowerCase().includes(searchLower) ||
          m.itemCode.toLowerCase().includes(searchLower) ||
          m.reportedProblem.toLowerCase().includes(searchLower) ||
          m.responsible.toLowerCase().includes(searchLower)
      )
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((m) => m.status === filters.status)
    }
    if (filters.type && filters.type !== "all") {
      result = result.filter((m) => m.maintenanceType === filters.type)
    }
    if (filters.criticality && filters.criticality !== "all") {
      result = result.filter((m) => m.criticality === filters.criticality)
    }

    return result
  }, [filters])

  const totalPages = Math.ceil(filteredMaintenances.length / itemsPerPage)
  const paginatedMaintenances = filteredMaintenances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const clearFilters = () => {
    setFilters(initialFilters)
    setCurrentPage(1)
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== "" && v !== "all").length

  const stats = useMemo(() => ({
    total: mockMaintenances.length,
    open: mockMaintenances.filter((m) => m.status === "Aberta").length,
    inProgress: mockMaintenances.filter((m) => m.status === "Em andamento" || m.status === "Aguardando peça").length,
    completed: mockMaintenances.filter((m) => m.status === "Concluída").length,
  }), [])

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Manutenção" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manutenção</h1>
            <p className="text-muted-foreground">
              Gerencie ordens de serviço e manutenções dos equipamentos
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Nova Ordem de Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nova Ordem de Serviço</DialogTitle>
                <DialogDescription>
                  Abra uma nova ordem de manutenção para um equipamento.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="item">Item</Label>
                  <Select>
                    <SelectTrigger id="item">
                      <SelectValue placeholder="Selecione o item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">LAB-FIS-EQ-001 - Osciloscópio Digital</SelectItem>
                      <SelectItem value="3">LAB-FIS-EQ-003 - Fonte de Alimentação DC</SelectItem>
                      <SelectItem value="8">LAB-FAB-IMP3D-001 - Impressora 3D FDM</SelectItem>
                      <SelectItem value="9">LAB-FIS-FER-001 - Alicate Amperímetro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mType">Tipo</Label>
                    <Select>
                      <SelectTrigger id="mType">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preventiva">Preventiva</SelectItem>
                        <SelectItem value="Corretiva">Corretiva</SelectItem>
                        <SelectItem value="Calibração">Calibração</SelectItem>
                        <SelectItem value="Inspeção">Inspeção</SelectItem>
                        <SelectItem value="Avaliação técnica">Avaliação técnica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mCriticality">Criticidade</Label>
                    <Select>
                      <SelectTrigger id="mCriticality">
                        <SelectValue placeholder="Criticidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input id="responsible" placeholder="Nome do responsável" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Fornecedor / Técnico</Label>
                  <Input id="supplier" placeholder="Ex: Manutenção interna" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="problem">Problema Reportado</Label>
                  <Textarea id="problem" placeholder="Descreva o problema..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost">Custo Estimado</Label>
                  <Input id="cost" placeholder="R$ 0,00" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Abrir Ordem</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Wrench className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Ordens registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Abertas</CardTitle>
              <AlertTriangle className="size-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.open}</div>
              <p className="text-xs text-muted-foreground">Aguardando início</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Loader2 className="size-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Em execução ou aguardando peças</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle2 className="size-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Finalizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Ordens de Serviço</CardTitle>
                <CardDescription>{filteredMaintenances.length} ordem(ns) encontrada(s)</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por item, problema..."
                    className="w-64 pl-8"
                    value={filters.search}
                    onChange={(e) => {
                      setFilters((prev) => ({ ...prev, search: e.target.value }))
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Filter className="size-4" />
                      {activeFilterCount > 1 && (
                        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {activeFilterCount - (filters.search ? 1 : 0)}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                      <SheetDescription>Refine a lista de manutenções</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={filters.status}
                          onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, status: value }))
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Aberta">Aberta</SelectItem>
                            <SelectItem value="Em andamento">Em andamento</SelectItem>
                            <SelectItem value="Concluída">Concluída</SelectItem>
                            <SelectItem value="Aguardando peça">Aguardando peça</SelectItem>
                            <SelectItem value="Terceirizada">Terceirizada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select
                          value={filters.type}
                          onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, type: value }))
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Preventiva">Preventiva</SelectItem>
                            <SelectItem value="Corretiva">Corretiva</SelectItem>
                            <SelectItem value="Calibração">Calibração</SelectItem>
                            <SelectItem value="Inspeção">Inspeção</SelectItem>
                            <SelectItem value="Avaliação técnica">Avaliação técnica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Criticidade</Label>
                        <Select
                          value={filters.criticality}
                          onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, criticality: value }))
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as criticidades" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Crítica">Crítica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Separator />
                      <Button variant="outline" className="w-full" onClick={clearFilters}>
                        <X className="mr-2 size-4" />
                        Limpar Filtros
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Problema</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Abertura</TableHead>
                  <TableHead>Criticidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMaintenances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      Nenhuma ordem de serviço encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMaintenances.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-mono text-xs">{m.itemCode}</TableCell>
                      <TableCell className="font-medium">{m.itemName}</TableCell>
                      <TableCell>{getTypeBadge(m.maintenanceType)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{m.reportedProblem}</TableCell>
                      <TableCell>{m.responsible}</TableCell>
                      <TableCell>{formatDate(m.openingDate)}</TableCell>
                      <TableCell>{getCriticalityBadge(m.criticality)}</TableCell>
                      <TableCell>{getStatusBadge(m.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 size-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            {m.status !== "Concluída" && (
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 size-4" />
                                Marcar como concluída
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Package className="mr-2 size-4" />
                              Ver item no inventário
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                    {Math.min(currentPage * itemsPerPage, filteredMaintenances.length)} de{" "}
                    {filteredMaintenances.length} registro(s)
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
