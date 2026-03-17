"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  MessageSquarePlus,
  Search,
  Filter,
  Plus,
  Eye,
  MoreHorizontal,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CircleDot,
  UserPlus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  FlaskConical,
  Bot,
  Image,
} from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockTaskRequests } from "@/lib/mock-data"
import type { TaskRequest, TaskPriority, TaskStatus, Laboratory } from "@/lib/types"
import { toast } from "sonner"

function getPriorityBadge(priority: TaskPriority) {
  switch (priority) {
    case "Crítica":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20">Crítica</Badge>
    case "Alta":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Alta</Badge>
    case "Média":
      return <Badge className="bg-info/15 text-info border-info/30 hover:bg-info/20">Média</Badge>
    case "Baixa":
      return <Badge variant="secondary">Baixa</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

function getStatusBadge(status: TaskStatus) {
  switch (status) {
    case "Aberta":
      return <Badge className="bg-info/15 text-info border-info/30 hover:bg-info/20">Aberta</Badge>
    case "Em análise":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Em análise</Badge>
    case "Em andamento":
      return <Badge className="bg-chart-4/15 text-chart-4 border-chart-4/30 hover:bg-chart-4/20">Em andamento</Badge>
    case "Concluída":
      return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">Concluída</Badge>
    case "Cancelada":
      return <Badge variant="secondary">Cancelada</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case "Aberta":
      return <CircleDot className="size-4 text-info" />
    case "Em análise":
      return <Search className="size-4 text-warning" />
    case "Em andamento":
      return <Loader2 className="size-4 text-chart-4" />
    case "Concluída":
      return <CheckCircle2 className="size-4 text-success" />
    case "Cancelada":
      return <X className="size-4 text-muted-foreground" />
  }
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatRelativeTime(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMin < 1) return "agora"
  if (diffMin < 60) return `há ${diffMin}min`
  if (diffHours < 24) return `há ${diffHours}h`
  return `há ${diffDays}d`
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

interface Filters {
  search: string
  status: string
  priority: string
  laboratory: string
  category: string
}

const initialFilters: Filters = {
  search: "",
  status: "",
  priority: "",
  laboratory: "",
  category: "",
}

export default function SolicitacoesPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    laboratories: [] as string[],
  })
  const itemsPerPage = 10

  const filteredTasks = useMemo(() => {
    let result = [...mockTaskRequests]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.requesterName.toLowerCase().includes(searchLower) ||
          task.assignees.some((a) => a.userName.toLowerCase().includes(searchLower))
      )
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((task) => task.status === filters.status)
    }
    if (filters.priority && filters.priority !== "all") {
      result = result.filter((task) => task.priority === filters.priority)
    }
    if (filters.laboratory && filters.laboratory !== "all") {
      result = result.filter((task) =>
        task.laboratories.includes(filters.laboratory as Laboratory)
      )
    }
    if (filters.category && filters.category !== "all") {
      result = result.filter((task) => task.category === filters.category)
    }

    // Sort: open/in-progress first, then by priority, then by date
    const priorityOrder: Record<string, number> = { "Crítica": 0, "Alta": 1, "Média": 2, "Baixa": 3 }
    const statusOrder: Record<string, number> = { "Aberta": 0, "Em análise": 1, "Em andamento": 2, "Concluída": 3, "Cancelada": 4 }

    result.sort((a, b) => {
      const statusDiff = statusOrder[a.status] - statusOrder[b.status]
      if (statusDiff !== 0) return statusDiff
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return result
  }, [filters])

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage)
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const clearFilters = () => {
    setFilters(initialFilters)
    setCurrentPage(1)
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== "" && v !== "all").length

  const stats = useMemo(() => ({
    total: mockTaskRequests.length,
    open: mockTaskRequests.filter((t) => t.status === "Aberta").length,
    inProgress: mockTaskRequests.filter((t) => t.status === "Em análise" || t.status === "Em andamento").length,
    completed: mockTaskRequests.filter((t) => t.status === "Concluída").length,
  }), [])

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.category || !newTask.priority || newTask.laboratories.length === 0) {
      toast.error("Preencha todos os campos obrigatórios.")
      return
    }
    toast.success("Solicitação criada com sucesso!")
    setIsCreateOpen(false)
    setNewTask({ title: "", description: "", category: "", priority: "", laboratories: [] })
  }

  const toggleLab = (lab: string) => {
    setNewTask((prev) => ({
      ...prev,
      laboratories: prev.laboratories.includes(lab)
        ? prev.laboratories.filter((l) => l !== lab)
        : [...prev.laboratories, lab],
    }))
  }

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Solicitações" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Solicitações</h1>
            <p className="text-muted-foreground">
              Gerencie solicitações de verificação e atividades para os laboratórios
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Nova Solicitação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Nova Solicitação</DialogTitle>
                <DialogDescription>
                  Crie uma nova solicitação para os monitores verificarem ou executarem nos laboratórios.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Título *</Label>
                  <Input
                    id="task-title"
                    placeholder="Ex: Verificar software MATLAB nos PCs"
                    value={newTask.title}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-desc">Descrição</Label>
                  <Textarea
                    id="task-desc"
                    placeholder="Descreva detalhadamente o que precisa ser verificado ou executado..."
                    rows={3}
                    value={newTask.description}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Categoria *</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Verificação de software">Verificação de software</SelectItem>
                        <SelectItem value="Verificação de hardware">Verificação de hardware</SelectItem>
                        <SelectItem value="Abertura de sala">Abertura de sala</SelectItem>
                        <SelectItem value="Fechamento de sala">Fechamento de sala</SelectItem>
                        <SelectItem value="Configuração de equipamento">Configuração de equipamento</SelectItem>
                        <SelectItem value="Limpeza/Organização">Limpeza/Organização</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Prioridade *</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Laboratórios *</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="lab-fisica"
                        checked={newTask.laboratories.includes("Laboratório de Física")}
                        onCheckedChange={() => toggleLab("Laboratório de Física")}
                      />
                      <Label htmlFor="lab-fisica" className="text-sm font-normal cursor-pointer">
                        Lab. Física
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="lab-robotica"
                        checked={newTask.laboratories.includes("Laboratório de Robótica")}
                        onCheckedChange={() => toggleLab("Laboratório de Robótica")}
                      />
                      <Label htmlFor="lab-robotica" className="text-sm font-normal cursor-pointer">
                        Lab. Robótica
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateTask}>Criar Solicitação</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <MessageSquarePlus className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Solicitações registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Abertas</CardTitle>
              <AlertCircle className="size-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.open}</div>
              <p className="text-xs text-muted-foreground">Aguardando atendimento</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Clock className="size-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Sendo atendidas</p>
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

        {/* Filters & Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Lista de Solicitações</CardTitle>
                <CardDescription>{filteredTasks.length} solicitação(ões) encontrada(s)</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título, solicitante..."
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
                      <SheetDescription>Refine a lista de solicitações</SheetDescription>
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
                            <SelectItem value="Em análise">Em análise</SelectItem>
                            <SelectItem value="Em andamento">Em andamento</SelectItem>
                            <SelectItem value="Concluída">Concluída</SelectItem>
                            <SelectItem value="Cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Prioridade</Label>
                        <Select
                          value={filters.priority}
                          onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, priority: value }))
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as prioridades" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="Crítica">Crítica</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Baixa">Baixa</SelectItem>
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
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select
                          value={filters.category}
                          onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, category: value }))
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as categorias" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="Verificação de software">Verificação de software</SelectItem>
                            <SelectItem value="Verificação de hardware">Verificação de hardware</SelectItem>
                            <SelectItem value="Abertura de sala">Abertura de sala</SelectItem>
                            <SelectItem value="Fechamento de sala">Fechamento de sala</SelectItem>
                            <SelectItem value="Configuração de equipamento">Configuração de equipamento</SelectItem>
                            <SelectItem value="Limpeza/Organização">Limpeza/Organização</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
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
                    <TableHead>Solicitação</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Laboratório(s)</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Responsável(is)</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                        Nenhuma solicitação encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTasks.map((task) => (
                      <TableRow key={task.id} className={task.priority === "Crítica" && task.status !== "Concluída" && task.status !== "Cancelada" ? "bg-destructive/5" : ""}>
                        <TableCell>{getStatusIcon(task.status)}</TableCell>
                        <TableCell>
                          <div className="max-w-[280px]">
                            <Link
                              href={`/solicitacoes/${task.id}`}
                              className="font-medium hover:underline line-clamp-1"
                            >
                              {task.title}
                            </Link>
                            <p className="text-xs text-muted-foreground line-clamp-1">{task.category}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                {getInitials(task.requesterName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.requesterName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {task.laboratories.map((lab) => (
                              <Badge key={lab} variant="outline" className="text-xs whitespace-nowrap">
                                {lab === "Laboratório de Física" ? "Física" : "Robótica"}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell>
                          {task.assignees.length === 0 ? (
                            <span className="text-xs text-muted-foreground italic">Sem responsável</span>
                          ) : (
                            <div className="flex -space-x-2">
                              {task.assignees.map((assignee) => (
                                <Avatar key={assignee.userId} className="size-6 border-2 border-background">
                                  <AvatarFallback className="text-[10px] bg-success/15 text-success">
                                    {getInitials(assignee.userName)}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatRelativeTime(task.createdAt)}</div>
                          <div className="text-xs text-muted-foreground">{formatDateTime(task.createdAt)}</div>
                        </TableCell>
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
                              <DropdownMenuItem asChild>
                                <Link href={`/solicitacoes/${task.id}`}>
                                  <Eye className="mr-2 size-4" />
                                  Ver detalhes
                                </Link>
                              </DropdownMenuItem>
                              {task.status === "Aberta" && (
                                <DropdownMenuItem>
                                  <UserPlus className="mr-2 size-4" />
                                  Assumir solicitação
                                </DropdownMenuItem>
                              )}
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
                    {Math.min(currentPage * itemsPerPage, filteredTasks.length)} de{" "}
                    {filteredTasks.length} registro(s)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
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
                      onClick={() => setCurrentPage((p) => p + 1)}
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
