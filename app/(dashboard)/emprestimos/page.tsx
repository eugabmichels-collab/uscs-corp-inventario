"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Undo2,
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
import { mockLoans } from "@/lib/mock-data"
import type { Loan } from "@/lib/types"

function getStatusBadge(status: string) {
  switch (status) {
    case "Ativo":
      return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">Ativo</Badge>
    case "Atrasado":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20">Atrasado</Badge>
    case "Devolvido":
      return <Badge variant="secondary">Devolvido</Badge>
    case "Pendente de aprovação":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Pendente</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getUserTypeBadge(type: string) {
  switch (type) {
    case "Professor":
      return <Badge className="bg-info/15 text-info border-info/30">Professor</Badge>
    case "Aluno":
      return <Badge variant="secondary">Aluno</Badge>
    case "Monitor":
      return <Badge className="bg-warning/15 text-warning border-warning/30">Monitor</Badge>
    case "Técnico":
      return <Badge variant="outline">Técnico</Badge>
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
  userType: string
  laboratory: string
}

const initialFilters: Filters = {
  search: "",
  status: "",
  userType: "",
  laboratory: "",
}

export default function EmprestimosPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredLoans = useMemo(() => {
    let result = [...mockLoans]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (loan) =>
          loan.itemName.toLowerCase().includes(searchLower) ||
          loan.itemCode.toLowerCase().includes(searchLower) ||
          loan.requesterName.toLowerCase().includes(searchLower) ||
          loan.purpose.toLowerCase().includes(searchLower)
      )
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((loan) => loan.status === filters.status)
    }
    if (filters.userType && filters.userType !== "all") {
      result = result.filter((loan) => loan.userType === filters.userType)
    }
    if (filters.laboratory && filters.laboratory !== "all") {
      result = result.filter((loan) => loan.originLab === filters.laboratory)
    }

    return result
  }, [filters])

  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage)
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const clearFilters = () => {
    setFilters(initialFilters)
    setCurrentPage(1)
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== "" && v !== "all").length

  const stats = useMemo(() => ({
    total: mockLoans.length,
    active: mockLoans.filter((l) => l.status === "Ativo").length,
    overdue: mockLoans.filter((l) => l.status === "Atrasado").length,
    returned: mockLoans.filter((l) => l.status === "Devolvido").length,
  }), [])

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Empréstimos" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Empréstimos</h1>
            <p className="text-muted-foreground">
              Gerencie os empréstimos de itens dos laboratórios
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Novo Empréstimo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Empréstimo</DialogTitle>
                <DialogDescription>
                  Registre um novo empréstimo de item do laboratório.
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
                      <SelectItem value="2">LAB-FIS-EQ-002 - Multímetro Digital</SelectItem>
                      <SelectItem value="4">LAB-ROB-KIT-001 - Kit Arduino</SelectItem>
                      <SelectItem value="5">LAB-ROB-EQ-001 - ESP32 DevKit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="requester">Solicitante</Label>
                    <Input id="requester" placeholder="Nome completo" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="userType">Tipo</Label>
                    <Select>
                      <SelectTrigger id="userType">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aluno">Aluno</SelectItem>
                        <SelectItem value="Professor">Professor</SelectItem>
                        <SelectItem value="Monitor">Monitor</SelectItem>
                        <SelectItem value="Técnico">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="identification">Identificação (RA / Matrícula)</Label>
                  <Input id="identification" placeholder="Ex: RA: 2021.1.0456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input id="quantity" type="number" min="1" defaultValue="1" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="returnDate">Devolução prevista</Label>
                    <Input id="returnDate" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purpose">Finalidade</Label>
                  <Input id="purpose" placeholder="Motivo do empréstimo" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Registrar Empréstimo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <ClipboardList className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Empréstimos registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <Clock className="size-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Aguardando devolução</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
              <AlertTriangle className="size-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">Pendentes de devolução</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Devolvidos</CardTitle>
              <CheckCircle2 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.returned}</div>
              <p className="text-xs text-muted-foreground">Concluídos</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Lista de Empréstimos</CardTitle>
                <CardDescription>{filteredLoans.length} empréstimo(s) encontrado(s)</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por item, solicitante..."
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
                      <SheetDescription>Refine a lista de empréstimos</SheetDescription>
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
                            <SelectItem value="Ativo">Ativo</SelectItem>
                            <SelectItem value="Atrasado">Atrasado</SelectItem>
                            <SelectItem value="Devolvido">Devolvido</SelectItem>
                            <SelectItem value="Pendente de aprovação">Pendente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo de Usuário</Label>
                        <Select
                          value={filters.userType}
                          onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, userType: value }))
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Aluno">Aluno</SelectItem>
                            <SelectItem value="Professor">Professor</SelectItem>
                            <SelectItem value="Monitor">Monitor</SelectItem>
                            <SelectItem value="Técnico">Técnico</SelectItem>
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
                  <TableHead>Código</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Qtd.</TableHead>
                  <TableHead>Retirada</TableHead>
                  <TableHead>Devolução Prevista</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      Nenhum empréstimo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-mono text-xs">{loan.itemCode}</TableCell>
                      <TableCell className="font-medium">{loan.itemName}</TableCell>
                      <TableCell>{loan.requesterName}</TableCell>
                      <TableCell>{getUserTypeBadge(loan.userType)}</TableCell>
                      <TableCell className="text-center">{loan.quantityBorrowed}</TableCell>
                      <TableCell>{formatDate(loan.withdrawalDate)}</TableCell>
                      <TableCell>{formatDate(loan.expectedReturnDate)}</TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
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
                            {loan.status !== "Devolvido" && (
                              <DropdownMenuItem>
                                <Undo2 className="mr-2 size-4" />
                                Registrar devolução
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <ClipboardList className="mr-2 size-4" />
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
                    {Math.min(currentPage * itemsPerPage, filteredLoans.length)} de{" "}
                    {filteredLoans.length} registro(s)
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
