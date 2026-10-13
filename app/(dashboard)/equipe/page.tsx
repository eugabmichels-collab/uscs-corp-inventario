"use client";
import {
  TablePagination,
  useTablePagination,
} from "@/components/table-pagination";
import { TableActionsMenu, TableActionsMenuContent, TableActionsMenuTrigger } from "@/components/table-actions-menu";
import { Topbar } from "@/components/topbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, getInitials } from "@/lib/format";
import { addAudit } from "@/lib/field-inventory-service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  MailPlus,
  Pencil,
  Search,
  ShieldOff,
  UserCheck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "Administrador" | "Inventariante" | "Visualizador";
  status: "Pendente" | "Ativo" | "Revogado";
  invitedAt?: string;
  createdAt?: string;
  statusBeforeRevocation?: "Pendente" | "Ativo";
};
const KEY = "uscs-team-v1";
const initial: Member[] = [
  {
    id: "admin",
    name: "Administrador do Sistema",
    email: "admin@uscs.edu.br",
    role: "Administrador",
    status: "Ativo",
  },
];
const inviteSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
});
type InviteForm = z.infer<typeof inviteSchema>;

export default function TeamPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "", email: "" },
  });
  const [role, setRole] = useState<Member["role"]>("Inventariante");
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("uscs-session") || "null");
    if (session?.role !== "Administrador") {
      router.replace("/dashboard");
      return;
    }
    setAuthorized(true);
    setMembers(JSON.parse(localStorage.getItem(KEY) || "null") || initial);
  }, [router]);
  const save = (next: Member[]) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setMembers(next);
  };
  const invite = (data: InviteForm) => {
    if (
      members.some(
        (member) => member.email.toLowerCase() === data.email.toLowerCase(),
      )
    ) {
      setError("email", {
        message: "Este e-mail já possui um membro ou convite registrado.",
      });
      return;
    }
    save([
      ...members,
      {
        id: crypto.randomUUID(),
        ...data,
        email: data.email.toLowerCase(),
        role: "Inventariante",
        status: "Pendente",
        invitedAt: new Date().toISOString(),
      },
    ]);
    addAudit(
      `Convite de membro registrado · ${data.name} · ${data.email.toLowerCase()}`,
    );
    reset();
    setInviteOpen(false);
  };
  const updateRole = () => {
    if (!editing) return;
    save(
      members.map((member) =>
        member.id === editing.id ? { ...member, role } : member,
      ),
    );
    if (editing.role !== role)
      addAudit(
        `Permissões de membro alteradas · ${editing.name} · ${editing.role} → ${role}`,
      );
    setEditing(null);
  };
  const toggleAccess = (member: Member) => {
    if (member.id === "admin") return;
    save(
      members.map((item) =>
        item.id !== member.id
          ? item
          : item.status === "Revogado"
            ? {
                ...item,
                status:
                  item.statusBeforeRevocation ??
                  (item.invitedAt ? "Pendente" : "Ativo"),
                statusBeforeRevocation: undefined,
              }
            : {
                ...item,
                statusBeforeRevocation: item.status,
                status: "Revogado",
              },
      ),
    );
    addAudit(
      `${member.status === "Revogado" ? "Acesso de membro restaurado" : member.status === "Pendente" ? "Convite de membro revogado" : "Acesso de membro revogado"} · ${member.name} · ${member.email}`,
    );
  };
  const filtered = members.filter(
    (member) =>
      `${member.name} ${member.email}`
        .toLocaleLowerCase("pt-BR")
        .includes(search.trim().toLocaleLowerCase("pt-BR")) &&
      (roleFilter === "all" || member.role === roleFilter) &&
      (statusFilter === "all" || member.status === statusFilter),
  );
  const pagination = useTablePagination(filtered);
  const visible = pagination.items;
  const selected = members.find((member) => member.id === detailId);
  const statusBadge = (member: Member) => (
    <Badge
      variant={member.status === "Revogado" ? "destructive" : "outline"}
      className={
        member.status === "Ativo"
          ? "border-success/30 bg-success/10 text-success"
          : member.status === "Pendente"
            ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            : ""
      }
    >
      {member.status}
    </Badge>
  );
  if (!authorized) return null;
  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Equipe" },
        ]}
      />
      <main className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Equipe</h1>
            <p className="text-muted-foreground">
              Convide membros e controle suas permissões de acesso.
            </p>
          </div>
          <Dialog
            open={inviteOpen}
            onOpenChange={(value) => {
              setInviteOpen(value);
              if (!value) reset();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <MailPlus className="mr-2 size-4" />
                Convidar usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar usuário</DialogTitle>
                <DialogDescription>
                  O membro receberá o acesso pelo e-mail informado quando o
                  serviço de autenticação estiver conectado.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit(invite)}>
                <div className="space-y-2">
                  <Label htmlFor="invite-name">Nome completo</Label>
                  <Input
                    id="invite-name"
                    {...register("name")}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-email">E-mail</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInviteOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Enviar convite</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total",
              value: members.length,
              description: "Membros e convites registrados",
              icon: Users,
            },
            {
              label: "Ativos",
              value: members.filter((member) => member.status === "Ativo")
                .length,
              description: "Com acesso ao sistema",
              icon: UserCheck,
            },
            {
              label: "Convites pendentes",
              value: members.filter((member) => member.status === "Pendente")
                .length,
              description: "Aguardando aceite do convite",
              icon: MailPlus,
            },
            {
              label: "Acessos revogados",
              value: members.filter((member) => member.status === "Revogado")
                .length,
              description: "Sem acesso ao sistema",
              icon: ShieldOff,
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <CardTitle>Membros do sistema</CardTitle>
                <CardDescription>
                  {filtered.length} registros encontrados.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    aria-label="Buscar membros por nome ou e-mail"
                    placeholder="Buscar por nome ou e-mail..."
                    className="pl-9 sm:w-64"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      pagination.setPage(1);
                    }}
                  />
                </div>
                <Select
                  value={roleFilter}
                  onValueChange={(value) => {
                    setRoleFilter(value);
                    pagination.setPage(1);
                  }}
                >
                  <SelectTrigger
                    aria-label="Filtrar por perfil"
                    className="w-full sm:w-44"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os perfis</SelectItem>
                    {["Administrador", "Inventariante", "Visualizador"].map(
                      (value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    pagination.setPage(1);
                  }}
                >
                  <SelectTrigger
                    aria-label="Filtrar por status"
                    className="w-full sm:w-40"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {["Pendente", "Ativo", "Revogado"].map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
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
                    <TableHead>Perfil de acesso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-13 text-center text-muted-foreground"
                      >
                        Nenhum membro encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visible.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{member.role}</Badge>
                        </TableCell>
                        <TableCell>{statusBadge(member)}</TableCell>
                        <TableCell>
                          <TableActionsMenu>
                            <TableActionsMenuTrigger label={member.name} />
                            <TableActionsMenuContent>
                              <DropdownMenuItem
                                onClick={() => setDetailId(member.id)}
                              >
                                <Eye className="size-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditing(member);
                                  setRole(member.role);
                                }}
                              >
                                <Pencil className="size-4" />
                                Editar permissões
                              </DropdownMenuItem>
                              {member.id !== "admin" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => toggleAccess(member)}
                                    variant={member.status !== "Revogado" ? "destructive" : "default"}
                                  >
                                    {member.status === "Revogado" ? (
                                      <UserCheck className="size-4" />
                                    ) : (
                                      <ShieldOff className="size-4" />
                                    )}
                                    {member.status === "Revogado"
                                      ? "Restaurar acesso"
                                      : member.status === "Pendente"
                                        ? "Revogar convite"
                                        : "Revogar acesso"}
                                  </DropdownMenuItem>
                                </>
                              )}
                            </TableActionsMenuContent>
                          </TableActionsMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {(search || roleFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                  pagination.setPage(1);
                }}
              >
                Limpar filtros
              </Button>
            )}
            <TablePagination {...pagination} />
          </CardContent>
        </Card>
        <Dialog
          open={!!selected}
          onOpenChange={(open) => !open && setDetailId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do membro</DialogTitle>
              <DialogDescription>
                Informações e permissões de acesso ao sistema.
              </DialogDescription>
            </DialogHeader>
            {selected && (
              <div className="space-y-6 py-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-12 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(selected.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold break-words">
                        {selected.name}
                      </p>
                      <p className="text-sm text-muted-foreground break-all">
                        {selected.email}
                      </p>
                    </div>
                  </div>
                  {statusBadge(selected)}
                </div>
                <dl className="grid gap-4 border-t pt-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Perfil de acesso
                    </dt>
                    <dd className="mt-1">
                      <Badge variant="secondary">{selected.role}</Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Convite registrado em
                    </dt>
                    <dd className="mt-1 text-sm">
                      {selected.invitedAt
                        ? formatDateTime(selected.invitedAt)
                        : "Não informado"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Cadastrado em
                    </dt>
                    <dd className="mt-1 text-sm">
                      {selected.createdAt
                        ? formatDateTime(selected.createdAt)
                        : selected.status === "Pendente"
                          ? "Aguardando aceite"
                          : "Não informado"}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          open={!!editing}
          onOpenChange={(value) => !value && setEditing(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar permissões</DialogTitle>
              <DialogDescription>{editing?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label>Permissão</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as Member["role"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Inventariante">Inventariante</SelectItem>
                  <SelectItem value="Visualizador">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button onClick={updateRole}>Salvar permissões</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
