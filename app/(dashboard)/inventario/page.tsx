"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Package,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Wrench,
  History,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { mockItems } from "@/lib/mock-data"
import type { InventoryItem } from "@/lib/types"

const categories = [
  "Equipamento de medição",
  "Equipamento de informática",
  "Equipamento de automação",
  "Equipamento de robótica",
  "Equipamento de fabricação digital",
  "Ferramenta técnica",
  "Kit didático",
  "Mobiliário técnico",
  "Consumível técnico",
  "EPI",
]

const laboratories = ["Laboratório de Física", "Laboratório de Robótica"]
const conservationStates = ["Ótimo", "Bom", "Regular", "Ruim", "Inoperante"]
const usageStatuses = ["Em uso", "Reserva", "Emprestado", "Em manutenção", "Em calibração", "Desativado", "Para descarte"]
const criticalities = ["Baixa", "Média", "Alta", "Crítica"]

function getStatusBadge(status: string) {
  switch (status) {
    case "Em uso":
      return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">Em uso</Badge>
    case "Reserva":
      return <Badge variant="secondary">Reserva</Badge>
    case "Emprestado":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Emprestado</Badge>
    case "Em manutenção":
      return <Badge className="bg-info/15 text-info border-info/30 hover:bg-info/20">Em manutenção</Badge>
    case "Em calibração":
      return <Badge className="bg-info/15 text-info border-info/30 hover:bg-info/20">Em calibração</Badge>
    case "Desativado":
      return <Badge variant="outline" className="text-muted-foreground">Desativado</Badge>
    case "Para descarte":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20">Para descarte</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getConservationBadge(state: string) {
  switch (state) {
    case "Ótimo":
      return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">Ótimo</Badge>
    case "Bom":
      return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">Bom</Badge>
    case "Regular":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Regular</Badge>
    case "Ruim":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20">Ruim</Badge>
    case "Inoperante":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20">Inoperante</Badge>
    default:
      return <Badge variant="outline">{state}</Badge>
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

interface Filters {
  search: string
  laboratory: string
  category: string
  conservationState: string
  usageStatus: string
  criticality: string
  patrimony: string
}

const initialFilters: Filters = {
  search: "",
  laboratory: "",
  category: "",
  conservationState: "",
  usageStatus: "",
  criticality: "",
  patrimony: "",
}

export default function InventoryPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredItems = useMemo(() => {
    let result = [...mockItems]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (item) =>
          item.internalCode.toLowerCase().includes(searchLower) ||
          item.patrimonyNumber.toLowerCase().includes(searchLower) ||
          item.name.toLowerCase().includes(searchLower) ||
          item.brand.toLowerCase().includes(searchLower) ||
          item.model.toLowerCase().includes(searchLower) ||
          item.location.toLowerCase().includes(searchLower)
      )
    }

    if (filters.laboratory && filters.laboratory !== "all") {
      result = result.filter((item) => item.laboratory === filters.laboratory)
    }
    if (filters.category && filters.category !== "all") {
      result = result.filter((item) => item.category === filters.category)
    }
    if (filters.conservationState && filters.conservationState !== "all") {
      result = result.filter((item) => item.conservationState === filters.conservationState)
    }
    if (filters.usageStatus && filters.usageStatus !== "all") {
      result = result.filter((item) => item.usageStatus === filters.usageStatus)
    }
    if (filters.criticality && filters.criticality !== "all") {
      result = result.filter((item) => item.criticality === filters.criticality)
    }
    if (filters.patrimony === "com") {
      result = result.filter(
        (item) =>
          item.patrimonyNumber !== "SEM PATRIMÔNIO" && item.patrimonyNumber !== "EM REGULARIZAÇÃO"
      )
    } else if (filters.patrimony === "sem") {
      result = result.filter(
        (item) =>
          item.patrimonyNumber === "SEM PATRIMÔNIO" || item.patrimonyNumber === "EM REGULARIZAÇÃO"
      )
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    return result
  }, [filters, sortConfig])

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" }
      }
      return { key, direction: "asc" }
    })
  }

  const clearFilters = () => {
    setFilters(initialFilters)
    setCurrentPage(1)
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== "" && v !== "all").length

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Inventário" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventário</h1>
            <p className="text-muted-foreground">
              Gestão completa do inventário patrimonial dos laboratórios
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 size-4" />
              Exportar
            </Button>
            <Button asChild>
              <Link href="/inventario/novo">
                <Plus className="mr-2 size-4" />
                Novo Item
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockItems.length}</div>
              <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lab. Física</CardTitle>
              <Package className="size-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockItems.filter((i) => i.laboratory === "Laboratório de Física").length}
              </div>
              <p className="text-xs text-muted-foreground">Itens no laboratório</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lab. Robótica</CardTitle>
              <Package className="size-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockItems.filter((i) => i.laboratory === "Laboratório de Robótica").length}
              </div>
              <p className="text-xs text-muted-foreground">Itens no laboratório</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sem Patrimônio</CardTitle>
              <Package className="size-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockItems.filter((i) => i.patrimonyNumber === "SEM PATRIMÔNIO" || i.patrimonyNumber === "EM REGULARIZAÇÃO").length}
              </div>
              <p className="text-xs text-muted-foreground">Pendentes de registro</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Lista de Itens</CardTitle>
                <CardDescription>{filteredItems.length} item(s) encontrado(s)</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código, nome, marca..."
                    className="w-64 pl-8"
                    value={filters.search}
                    onChange={(e) => {
                      setFilters({ ...filters, search: e.target.value })
                      setCurrentPage(1)
                    }}
                  />
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Filter className="size-4" />
                      {activeFilterCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Filtros Avançados</SheetTitle>
                      <SheetDescription>
                        Refine a busca utilizando os filtros abaixo
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label>Laboratório</Label>
                        <Select
                          value={filters.laboratory}
                          onValueChange={(v) => setFilters({ ...filters, laboratory: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os laboratórios" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os laboratórios</SelectItem>
                            {laboratories.map((lab) => (
                              <SelectItem key={lab} value={lab}>
                                {lab}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select
                          value={filters.category}
                          onValueChange={(v) => setFilters({ ...filters, category: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as categorias" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as categorias</SelectItem>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Estado de Conservação</Label>
                        <Select
                          value={filters.conservationState}
                          onValueChange={(v) => setFilters({ ...filters, conservationState: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os estados" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os estados</SelectItem>
                            {conservationStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Situação de Uso</Label>
                        <Select
                          value={filters.usageStatus}
                          onValueChange={(v) => setFilters({ ...filters, usageStatus: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as situações" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as situações</SelectItem>
                            {usageStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Criticidade</Label>
                        <Select
                          value={filters.criticality}
                          onValueChange={(v) => setFilters({ ...filters, criticality: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as criticidades" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as criticidades</SelectItem>
                            {criticalities.map((crit) => (
                              <SelectItem key={crit} value={crit}>
                                {crit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Patrimônio</Label>
                        <Select
                          value={filters.patrimony}
                          onValueChange={(v) => setFilters({ ...filters, patrimony: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="com">Com patrimônio</SelectItem>
                            <SelectItem value="sem">Sem patrimônio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearFilters}
                      >
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
                    <TableHead className="w-[120px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8"
                        onClick={() => handleSort("internalCode")}
                      >
                        Código
                        <ArrowUpDown className="ml-2 size-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Patrimônio</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8"
                        onClick={() => handleSort("name")}
                      >
                        Nome
                        <ArrowUpDown className="ml-2 size-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Conservação</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead>Criticidade</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                        Nenhum item encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.internalCode}</TableCell>
                        <TableCell>
                          {item.patrimonyNumber === "SEM PATRIMÔNIO" ||
                          item.patrimonyNumber === "EM REGULARIZAÇÃO" ? (
                            <Badge variant="outline" className="text-muted-foreground">
                              {item.patrimonyNumber}
                            </Badge>
                          ) : (
                            <span className="font-mono text-sm">{item.patrimonyNumber}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {item.brand} {item.model}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{item.category}</TableCell>
                        <TableCell className="text-sm">{item.location}</TableCell>
                        <TableCell>{getConservationBadge(item.conservationState)}</TableCell>
                        <TableCell>{getStatusBadge(item.usageStatus)}</TableCell>
                        <TableCell>{getCriticalityBadge(item.criticality)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/inventario/${item.id}`}>
                                  <Eye className="mr-2 size-4" />
                                  Ver Detalhes
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/inventario/${item.id}/editar`}>
                                  <Edit className="mr-2 size-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/manutencao/nova?item=${item.id}`}>
                                  <Wrench className="mr-2 size-4" />
                                  Registrar Manutenção
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/auditoria?item=${item.id}`}>
                                  <History className="mr-2 size-4" />
                                  Ver Histórico
                                </Link>
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
                    {Math.min(currentPage * itemsPerPage, filteredItems.length)} de{" "}
                    {filteredItems.length} registro(s)
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
