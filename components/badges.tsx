import React from "react"
import {
  CircleDot,
  Search,
  Loader2,
  CheckCircle2,
  X,
  Package,
  Edit,
  ClipboardList,
  RotateCcw,
  Wrench,
  MapPin,
  UserCheck,
  AlertTriangle,
  Paperclip,
  History,
  MessageSquare,
  UserPlus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { TaskPriority, TaskStatus } from "@/lib/types"

// ── Inventário ──────────────────────────────────────────────

export function getItemStatusBadge(status: string) {
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

export function getConservationBadge(state: string) {
  switch (state) {
    case "Ótimo":
    case "Bom":
      return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">{state}</Badge>
    case "Regular":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">{state}</Badge>
    case "Ruim":
    case "Inoperante":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20">{state}</Badge>
    default:
      return <Badge variant="outline">{state}</Badge>
  }
}

export function getCriticalityBadge(criticality: string) {
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

// ── Empréstimos ─────────────────────────────────────────────

export function getLoanStatusBadge(status: string) {
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

export function getUserTypeBadge(type: string) {
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

// ── Manutenção ──────────────────────────────────────────────

export function getMaintenanceStatusBadge(status: string) {
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

export function getMaintenanceTypeBadge(type: string) {
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

// ── Solicitações / Tasks ────────────────────────────────────

export function getTaskPriorityBadge(priority: TaskPriority) {
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

export function getTaskStatusBadge(status: TaskStatus) {
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

export function getTaskStatusIcon(status: TaskStatus) {
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

// ── Auditoria ───────────────────────────────────────────────

export function getAuditActionIcon(action: string) {
  switch (action) {
    case "Criação":
      return <Package className="size-4 text-success" />
    case "Edição":
      return <Edit className="size-4 text-info" />
    case "Empréstimo":
      return <ClipboardList className="size-4 text-warning" />
    case "Devolução":
      return <RotateCcw className="size-4 text-success" />
    case "Manutenção":
      return <Wrench className="size-4 text-info" />
    case "Alteração de localização":
      return <MapPin className="size-4 text-muted-foreground" />
    case "Mudança de responsável":
      return <UserCheck className="size-4 text-muted-foreground" />
    case "Alteração de estado":
    case "Alteração de condição":
      return <AlertTriangle className="size-4 text-warning" />
    case "Anexo adicionado":
      return <Paperclip className="size-4 text-muted-foreground" />
    default:
      return <History className="size-4 text-muted-foreground" />
  }
}

export function getAuditActionBadge(action: string) {
  switch (action) {
    case "Criação":
      return <Badge className="bg-success/15 text-success border-success/30">Criação</Badge>
    case "Edição":
      return <Badge className="bg-info/15 text-info border-info/30">Edição</Badge>
    case "Empréstimo":
      return <Badge className="bg-warning/15 text-warning border-warning/30">Empréstimo</Badge>
    case "Devolução":
      return <Badge className="bg-success/15 text-success border-success/30">Devolução</Badge>
    case "Manutenção":
      return <Badge className="bg-info/15 text-info border-info/30">Manutenção</Badge>
    case "Alteração de estado":
    case "Alteração de condição":
      return <Badge className="bg-warning/15 text-warning border-warning/30">{action}</Badge>
    default:
      return <Badge variant="secondary">{action}</Badge>
  }
}

// ── Usuários ────────────────────────────────────────────────

export function getRoleBadge(role: string) {
  switch (role) {
    case "Administrador":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30">Administrador</Badge>
    case "Professor":
      return <Badge className="bg-info/15 text-info border-info/30">Professor</Badge>
    case "Técnico/Laboratorista":
      return <Badge className="bg-warning/15 text-warning border-warning/30">Técnico/Lab.</Badge>
    case "Monitor":
      return <Badge className="bg-success/15 text-success border-success/30">Monitor</Badge>
    case "Visualizador":
      return <Badge variant="secondary">Visualizador</Badge>
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

export function getUserStatusBadge(status: string) {
  switch (status) {
    case "Ativo":
      return <Badge className="bg-success/15 text-success border-success/30">Ativo</Badge>
    case "Inativo":
      return <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

// ── Task Activity (task-detail) ─────────────────────────────

export function getActivityIcon(action: string) {
  if (action.includes("Criou")) return <CircleDot className="size-4 text-info" />
  if (action.includes("Assumiu")) return <UserPlus className="size-4 text-chart-4" />
  if (action.includes("Atualizou")) return <MessageSquare className="size-4 text-warning" />
  if (action.includes("Concluiu")) return <CheckCircle2 className="size-4 text-success" />
  return <MessageSquare className="size-4 text-muted-foreground" />
}

// ── Dashboard (unifica status de empréstimos + manutenções) ─

export function getDashboardStatusBadge(status: string) {
  switch (status) {
    case "Ativo":
      return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">Ativo</Badge>
    case "Atrasado":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20">Atrasado</Badge>
    case "Devolvido":
      return <Badge variant="secondary">Devolvido</Badge>
    case "Aberta":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Aberta</Badge>
    case "Em andamento":
      return <Badge className="bg-info/15 text-info border-info/30 hover:bg-info/20">Em andamento</Badge>
    case "Concluída":
      return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">Concluída</Badge>
    case "Aguardando peça":
      return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Aguardando peça</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
