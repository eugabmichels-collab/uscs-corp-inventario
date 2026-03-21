"use client"

import { useState, useMemo } from "react"
import {
  History,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Package,
  Wrench,
  ClipboardList,
  Edit,
  MapPin,
  UserCheck,
  AlertTriangle,
  Paperclip,
  RotateCcw,
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
import { mockAuditLogs } from "@/lib/mock-data"
import { getAuditActionIcon, getAuditActionBadge } from "@/components/badges"
import { formatDateTime } from "@/lib/format"

const getActionIcon = getAuditActionIcon
const getActionBadge = getAuditActionBadge

interface Filters {
  search: string
  action: string
  laboratory: string
}

const initialFilters: Filters = {
  search: "",
  action: "",
  laboratory: "",
}

export default function AuditoriaPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredLogs = useMemo(() => {
    let result = [...mockAuditLogs]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (log) =>
          log.itemCode.toLowerCase().includes(searchLower) ||
          log.userName.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower)
      )
    }

    if (filters.action && filters.action !== "all") {
      result = result.filter((log) => log.action === filters.action)
    }
    if (filters.laboratory && filters.laboratory !== "all") {
      result = result.filter((log) => log.laboratory === filters.laboratory)
    }

    return result
  }, [filters])

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const clearFilters = () => {
    setFilters(initialFilters)
    setCurrentPage(1)
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== "" && v !== "all").length

  const actionTypes = useMemo(() => {
    const types = new Set(mockAuditLogs.map((log) => log.action))
    return Array.from(types).sort()
  }, [])

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Histórico e Auditoria" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Histórico e Auditoria</h1>
            <p className="text-muted-foreground">
              Registro completo de todas as ações realizadas no sistema
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
              <History className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAuditLogs.length}</div>
              <p className="text-xs text-muted-foreground">Ações registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Manutenções</CardTitle>
              <Wrench className="size-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAuditLogs.filter((l) => l.action === "Manutenção").length}
              </div>
              <p className="text-xs text-muted-foreground">Registros de manutenção</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Empréstimos</CardTitle>
              <ClipboardList className="size-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAuditLogs.filter((l) => l.action === "Empréstimo").length}
              </div>
              <p className="text-xs text-muted-foreground">Registros de empréstimo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Edições</CardTitle>
              <Edit className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAuditLogs.filter((l) => l.action === "Edição" || l.action === "Criação").length}
              </div>
              <p className="text-xs text-muted-foreground">Criações e edições</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Log de Atividades</CardTitle>
                <CardDescription>{filteredLogs.length} registro(s) encontrado(s)</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código, usuário..."
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
                      <SheetDescription>Refine o log de atividades</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label>Tipo de Ação</Label>
                        <Select
                          value={filters.action}
                          onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, action: value }))
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as ações" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {actionTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Laboratório</Label>
                        <Select
                          value={filters.laboratory}
                          onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, laboratory: value }))
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os laboratórios" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Laboratório de Física">Lab. Física</SelectItem>
                            <SelectItem value="Laboratório de Robótica">Lab. Robótica</SelectItem>
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
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Código do Item</TableHead>
                  <TableHead>Laboratório</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{getActionIcon(log.action)}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{formatDateTime(log.timestamp)}</TableCell>
                      <TableCell className="font-medium">{log.userName}</TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell className="font-mono text-xs">{log.itemCode}</TableCell>
                      <TableCell className="text-sm">
                        {log.laboratory === "Laboratório de Física" ? "Lab. Física" : "Lab. Robótica"}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                        {log.details}
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
                    {Math.min(currentPage * itemsPerPage, filteredLogs.length)} de{" "}
                    {filteredLogs.length} registro(s)
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
