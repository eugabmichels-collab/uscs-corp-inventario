"use client"

import { useState, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Shield,
  UserX,
  UserCheck,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockUsers } from "@/lib/mock-data"
import type { User as SystemUser } from "@/lib/types"
import { getRoleBadge, getUserStatusBadge } from "@/components/badges"
import { formatDateTime, getInitials } from "@/lib/format"
import { toast } from "sonner"

const getStatusBadge = getUserStatusBadge

const newUserSchema = z.object({
  name: z.string().min(1, "Informe o nome completo."),
  email: z
    .string()
    .min(1, "Informe o e-mail.")
    .email("Informe um e-mail válido.")
    .refine(
      (val) => val.endsWith("@uscs.edu.br") || val.endsWith("@uscsscs.edu.br"),
      "Utilize um e-mail institucional (@uscs.edu.br)."
    ),
  role: z.string().min(1, "Selecione o perfil."),
  laboratory: z.string().min(1, "Selecione o laboratório."),
})

type NewUserFormData = z.infer<typeof newUserSchema>

interface Filters {
  search: string
  role: string
  status: string
}

const initialFilters: Filters = {
  search: "",
  role: "",
  status: "",
}

export default function UsuariosPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<NewUserFormData>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      laboratory: "",
    },
  })

  const onSubmitUser = (data: NewUserFormData) => {
    console.log("Novo usuário:", data)
    reset()
    setDialogOpen(false)
  }

  const filteredUsers = useMemo(() => {
    let result = [...mockUsers]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
    }

    if (filters.role && filters.role !== "all") {
      result = result.filter((user) => user.role === filters.role)
    }
    if (filters.status && filters.status !== "all") {
      result = result.filter((user) => user.status === filters.status)
    }

    return result
  }, [filters])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = useMemo(() => ({
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === "Ativo").length,
    inactive: mockUsers.filter((u) => u.status === "Inativo").length,
    admins: mockUsers.filter((u) => u.role === "Administrador").length,
  }), [])

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Usuários" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie os usuários e permissões do sistema
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { reset(); setDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Usuário</DialogTitle>
                <DialogDescription>
                  Cadastre um novo usuário no sistema.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmitUser)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      placeholder="Nome do usuário"
                      {...register("name")}
                      className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@uscs.edu.br"
                      {...register("email")}
                      className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="role">Perfil</Label>
                      <Controller
                        control={control}
                        name="role"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="role" className={errors.role ? "border-destructive focus-visible:ring-destructive" : ""}>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Administrador">Administrador</SelectItem>
                              <SelectItem value="Professor">Professor</SelectItem>
                              <SelectItem value="Técnico/Laboratorista">Técnico/Lab.</SelectItem>
                              <SelectItem value="Monitor">Monitor</SelectItem>
                              <SelectItem value="Visualizador">Visualizador</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lab">Laboratório</Label>
                      <Controller
                        control={control}
                        name="laboratory"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="lab" className={errors.laboratory ? "border-destructive focus-visible:ring-destructive" : ""}>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Todos">Todos</SelectItem>
                              <SelectItem value="Laboratório de Física">Lab. Física</SelectItem>
                              <SelectItem value="Laboratório de Robótica">Lab. Robótica</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.laboratory && <p className="text-sm text-destructive">{errors.laboratory.message}</p>}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => { reset(); setDialogOpen(false); }}>Cancelar</Button>
                  <Button type="submit">Cadastrar Usuário</Button>
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
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <UserCheck className="size-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Com acesso ao sistema</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inativos</CardTitle>
              <UserX className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">Sem acesso</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="size-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.admins}</div>
              <p className="text-xs text-muted-foreground">Acesso total</p>
            </CardContent>
          </Card>
        </div>

        {/* Users table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>{filteredUsers.length} usuário(s) encontrado(s)</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email..."
                    className="w-64 pl-8"
                    value={filters.search}
                    onChange={(e) => {
                      setFilters((prev) => ({ ...prev, search: e.target.value }))
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <Select
                  value={filters.role}
                  onValueChange={(value) => {
                    setFilters((prev) => ({ ...prev, role: value }))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Técnico/Laboratorista">Técnico/Lab.</SelectItem>
                    <SelectItem value="Monitor">Monitor</SelectItem>
                    <SelectItem value="Visualizador">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.status}
                  onValueChange={(value) => {
                    setFilters((prev) => ({ ...prev, status: value }))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Laboratório</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-sm">
                        {user.linkedLaboratory === "Todos"
                          ? "Todos"
                          : user.linkedLaboratory === "Laboratório de Física"
                          ? "Lab. Física"
                          : "Lab. Robótica"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(user.lastAccess)}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setDetailOpen(true); }}>
                              <Eye className="mr-2 size-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast.info(`Edição do usuário "${user.name}" em breve.`)
                            }}>
                              <Edit className="mr-2 size-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast.info(`Alteração de perfil do usuário "${user.name}" em breve.`)
                            }}>
                              <Shield className="mr-2 size-4" />
                              Alterar perfil
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "Ativo" ? (
                              <DropdownMenuItem className="text-destructive" onClick={() => {
                                toast.success(`Usuário "${user.name}" desativado com sucesso.`)
                              }}>
                                <UserX className="mr-2 size-4" />
                                Desativar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => {
                                toast.success(`Usuário "${user.name}" reativado com sucesso.`)
                              }}>
                                <UserCheck className="mr-2 size-4" />
                                Reativar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>            </div>

            {totalPages > 1 && (
              <>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de{" "}
                    {filteredUsers.length} registro(s)
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
            )}          </CardContent>
        </Card>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Informações completas do usuário
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(selectedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                {getStatusBadge(selectedUser.status)}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Perfil</p>
                  <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Laboratório</p>
                  <p className="text-sm mt-1">
                    {selectedUser.linkedLaboratory === "Todos"
                      ? "Todos"
                      : selectedUser.linkedLaboratory === "Laboratório de Física"
                      ? "Lab. Física"
                      : "Lab. Robótica"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Último Acesso</p>
                  <p className="text-sm mt-1">{formatDateTime(selectedUser.lastAccess)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cadastrado em</p>
                  <p className="text-sm mt-1">{formatDateTime(selectedUser.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
