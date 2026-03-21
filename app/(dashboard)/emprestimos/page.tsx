"use client"

import { useState, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import {
  ClipboardList,
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
  Undo2,
  User,
  Calendar,
  Package,
  MapPin,
  FileText,
  Hash,
} from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockLoans } from "@/lib/mock-data"
import type { Loan } from "@/lib/types"
import { getLoanStatusBadge, getUserTypeBadge } from "@/components/badges"
import { formatDate, formatDateTime, getInitials } from "@/lib/format"
import { toast } from "sonner"

const getStatusBadge = getLoanStatusBadge

const newLoanSchema = z.object({
  item: z.string().min(1, "Selecione um item."),
  requester: z.string().min(1, "Informe o nome do solicitante."),
  userType: z.string().min(1, "Selecione o tipo de usuário."),
  identification: z.string().min(1, "Informe o RA ou matrícula."),
  quantity: z.coerce.number().min(1, "A quantidade mínima é 1."),
  returnDate: z.string().min(1, "Informe a data de devolução prevista."),
  purpose: z.string().min(1, "Informe a finalidade do empréstimo."),
})

type NewLoanFormData = z.infer<typeof newLoanSchema>

const returnSchema = z.object({
  receivingResponsible: z.string().min(1, "Informe quem recebeu o item."),
  observations: z.string().optional(),
})

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
  const router = useRouter()
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<NewLoanFormData>({
    resolver: zodResolver(newLoanSchema),
    defaultValues: {
      item: "",
      requester: "",
      userType: "",
      identification: "",
      quantity: 1,
      returnDate: "",
      purpose: "",
    },
  })

  const onSubmitLoan = (data: NewLoanFormData) => {
    console.log("Novo empréstimo:", data)
    reset()
    setDialogOpen(false)
  }

  const {
    register: registerReturn,
    handleSubmit: handleSubmitReturn,
    reset: resetReturn,
    formState: { errors: returnErrors },
  } = useForm<z.infer<typeof returnSchema>>({
    resolver: zodResolver(returnSchema),
    defaultValues: { receivingResponsible: "", observations: "" },
  })

  const onSubmitReturn = (data: z.infer<typeof returnSchema>) => {
    console.log("Devolução registrada:", { loanId: selectedLoan?.id, ...data })
    toast.success(`Devolução do item "${selectedLoan?.itemName}" registrada com sucesso!`)
    resetReturn()
    setReturnOpen(false)
    setSelectedLoan(null)
  }

  const openDetail = (loan: Loan) => {
    setSelectedLoan(loan)
    setDetailOpen(true)
  }

  const openReturn = (loan: Loan) => {
    setSelectedLoan(loan)
    resetReturn()
    setReturnOpen(true)
  }

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
          <Dialog open={dialogOpen} onOpenChange={(open) => { reset(); setDialogOpen(open); }}>
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
              <form onSubmit={handleSubmit(onSubmitLoan)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="item">Item</Label>
                    <Controller
                      control={control}
                      name="item"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            id="item"
                            className={`w-full ${errors.item ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          >
                            <SelectValue placeholder="Selecione o item" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">LAB-FIS-EQ-001 - Osciloscópio Digital</SelectItem>
                            <SelectItem value="2">LAB-FIS-EQ-002 - Multímetro Digital</SelectItem>
                            <SelectItem value="4">LAB-ROB-KIT-001 - Kit Arduino</SelectItem>
                            <SelectItem value="5">LAB-ROB-EQ-001 - ESP32 DevKit</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.item && <p className="text-sm text-destructive">{errors.item.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="requester">Solicitante</Label>
                      <Input
                        id="requester"
                        placeholder="Nome completo"
                        {...register("requester")}
                        className={errors.requester ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {errors.requester && <p className="text-sm text-destructive">{errors.requester.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="userType">Tipo</Label>
                      <Controller
                        control={control}
                        name="userType"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger
                              id="userType"
                              className={`w-full ${errors.userType ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            >
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Aluno">Aluno</SelectItem>
                              <SelectItem value="Professor">Professor</SelectItem>
                              <SelectItem value="Monitor">Monitor</SelectItem>
                              <SelectItem value="Técnico">Técnico</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.userType && <p className="text-sm text-destructive">{errors.userType.message}</p>}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="identification">Identificação (RA / Matrícula)</Label>
                    <Input
                      id="identification"
                      placeholder="Ex: RA: 2021.1.0456"
                      {...register("identification")}
                      className={errors.identification ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.identification && <p className="text-sm text-destructive">{errors.identification.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantidade</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        {...register("quantity")}
                        className={errors.quantity ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="returnDate">Devolução prevista</Label>
                      <Input
                        id="returnDate"
                        type="date"
                        {...register("returnDate")}
                        className={errors.returnDate ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {errors.returnDate && <p className="text-sm text-destructive">{errors.returnDate.message}</p>}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purpose">Finalidade</Label>
                    <Input
                      id="purpose"
                      placeholder="Motivo do empréstimo"
                      {...register("purpose")}
                      className={errors.purpose ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.purpose && <p className="text-sm text-destructive">{errors.purpose.message}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => { reset(); setDialogOpen(false); }}>Cancelar</Button>
                  <Button type="submit">Registrar Empréstimo</Button>
                </DialogFooter>
              </form>
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
                    <TableRow key={loan.id} className={loan.status === "Atrasado" ? "bg-destructive/5" : ""}>
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
                            <DropdownMenuItem onClick={() => openDetail(loan)}>
                              <Eye className="mr-2 size-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            {loan.status !== "Devolvido" && (
                              <DropdownMenuItem onClick={() => openReturn(loan)}>
                                <Undo2 className="mr-2 size-4" />
                                Registrar devolução
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => router.push(`/inventario/${loan.itemId}`)}>
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

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Empréstimo</DialogTitle>
            <DialogDescription>
              Informações completas do registro de empréstimo
            </DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-6 py-4">
              {/* Status + Item header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(selectedLoan.requesterName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedLoan.requesterName}</p>
                    <p className="text-sm text-muted-foreground">{selectedLoan.identification}</p>
                  </div>
                </div>
                {getStatusBadge(selectedLoan.status)}
              </div>

              <Separator />

              {/* Item info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Item</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Hash className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Código</p>
                      <p className="text-sm font-mono">{selectedLoan.itemCode}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Package className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Nome</p>
                      <p className="text-sm font-medium">{selectedLoan.itemName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Laboratório de Origem</p>
                      <p className="text-sm">{selectedLoan.originLab}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ClipboardList className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Quantidade</p>
                      <p className="text-sm">{selectedLoan.quantityBorrowed} unidade(s)</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Solicitante info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Solicitante</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Tipo de Usuário</p>
                      <div className="mt-0.5">{getUserTypeBadge(selectedLoan.userType)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Finalidade</p>
                      <p className="text-sm">{selectedLoan.purpose}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dates */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Datas</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Data de Retirada</p>
                      <p className="text-sm">{formatDate(selectedLoan.withdrawalDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Devolução Prevista</p>
                      <p className="text-sm">{formatDate(selectedLoan.expectedReturnDate)}</p>
                    </div>
                  </div>
                  {selectedLoan.actualReturnDate && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Devolvido em</p>
                        <p className="text-sm">{formatDate(selectedLoan.actualReturnDate)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Clock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Registrado em</p>
                      <p className="text-sm">{formatDateTime(selectedLoan.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Responsáveis */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Responsáveis</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Entrega</p>
                    <p className="text-sm">{selectedLoan.deliveryResponsible}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Recebimento</p>
                    <p className="text-sm">{selectedLoan.receivingResponsible || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Observations */}
              {selectedLoan.observations && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Observações</h4>
                    <p className="text-sm rounded-md bg-muted/50 p-3">{selectedLoan.observations}</p>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedLoan && selectedLoan.status !== "Devolvido" && (
              <Button
                onClick={() => {
                  setDetailOpen(false)
                  if (selectedLoan) openReturn(selectedLoan)
                }}
              >
                <Undo2 className="mr-2 size-4" />
                Registrar Devolução
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                if (selectedLoan) router.push(`/inventario/${selectedLoan.itemId}`)
              }}
            >
              <ClipboardList className="mr-2 size-4" />
              Ver no Inventário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={returnOpen} onOpenChange={(open) => { if (!open) resetReturn(); setReturnOpen(open); }}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Registrar Devolução</DialogTitle>
            <DialogDescription>
              {selectedLoan && (
                <>Registrar devolução de <strong>{selectedLoan.quantityBorrowed}x {selectedLoan.itemName}</strong> emprestado(s) para <strong>{selectedLoan.requesterName}</strong>.</>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <form onSubmit={handleSubmitReturn(onSubmitReturn)}>
              <div className="grid gap-4 py-4">
                <div className="rounded-md border p-3 space-y-1 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{selectedLoan.itemCode}</span>
                    {getStatusBadge(selectedLoan.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Retirada: {formatDate(selectedLoan.withdrawalDate)} · Previsto: {formatDate(selectedLoan.expectedReturnDate)}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="receivingResponsible">Recebido por *</Label>
                  <Input
                    id="receivingResponsible"
                    placeholder="Nome de quem recebeu o item"
                    {...registerReturn("receivingResponsible")}
                    className={returnErrors.receivingResponsible ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {returnErrors.receivingResponsible && (
                    <p className="text-sm text-destructive">{returnErrors.receivingResponsible.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="returnObs">Observações</Label>
                  <Textarea
                    id="returnObs"
                    placeholder="Estado do item na devolução, danos, etc."
                    rows={3}
                    {...registerReturn("observations")}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { resetReturn(); setReturnOpen(false); }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <CheckCircle2 className="mr-2 size-4" />
                  Confirmar Devolução
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
