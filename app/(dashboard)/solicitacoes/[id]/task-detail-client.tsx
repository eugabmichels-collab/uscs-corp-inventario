"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Clock,
  User,
  CheckCircle2,
  CircleDot,
  Search,
  Loader2,
  X,
  FlaskConical,
  MessageSquare,
  UserPlus,
  Send,
  Image,
  AlertCircle,
  CalendarClock,
  Tag,
  FileText,
} from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getTaskRequestById } from "@/lib/mock-data"
import type { TaskPriority, TaskStatus } from "@/lib/types"
import { toast } from "sonner"

function getPriorityBadge(priority: TaskPriority) {
  switch (priority) {
    case "Crítica":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30">Crítica</Badge>
    case "Alta":
      return <Badge className="bg-warning/15 text-warning border-warning/30">Alta</Badge>
    case "Média":
      return <Badge className="bg-info/15 text-info border-info/30">Média</Badge>
    case "Baixa":
      return <Badge variant="secondary">Baixa</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

function getStatusBadge(status: TaskStatus) {
  switch (status) {
    case "Aberta":
      return <Badge className="bg-info/15 text-info border-info/30">Aberta</Badge>
    case "Em análise":
      return <Badge className="bg-warning/15 text-warning border-warning/30">Em análise</Badge>
    case "Em andamento":
      return <Badge className="bg-chart-4/15 text-chart-4 border-chart-4/30">Em andamento</Badge>
    case "Concluída":
      return <Badge className="bg-success/15 text-success border-success/30">Concluída</Badge>
    case "Cancelada":
      return <Badge variant="secondary">Cancelada</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case "Aberta":
      return <CircleDot className="size-5 text-info" />
    case "Em análise":
      return <Search className="size-5 text-warning" />
    case "Em andamento":
      return <Loader2 className="size-5 text-chart-4" />
    case "Concluída":
      return <CheckCircle2 className="size-5 text-success" />
    case "Cancelada":
      return <X className="size-5 text-muted-foreground" />
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

function getDuration(start: string, end: string | null) {
  if (!end) return null
  const diffMs = new Date(end).getTime() - new Date(start).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin} min`
  const hours = Math.floor(diffMin / 60)
  const mins = diffMin % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

function getActivityIcon(action: string) {
  if (action.includes("Criou")) return <CircleDot className="size-4 text-info" />
  if (action.includes("Assumiu")) return <UserPlus className="size-4 text-chart-4" />
  if (action.includes("Atualizou")) return <MessageSquare className="size-4 text-warning" />
  if (action.includes("Concluiu")) return <CheckCircle2 className="size-4 text-success" />
  return <MessageSquare className="size-4 text-muted-foreground" />
}

export default function TaskDetailClient({ id }: { id: string }) {
  const task = getTaskRequestById(id)
  const [newComment, setNewComment] = useState("")
  const [selectedAction, setSelectedAction] = useState("")

  if (!task) {
    notFound()
  }

  const isActive = task.status !== "Concluída" && task.status !== "Cancelada"
  const totalDuration = getDuration(task.createdAt, task.completedAt)

  const handleSubmitAction = () => {
    if (!newComment.trim()) {
      toast.error("Adicione um comentário antes de enviar.")
      return
    }
    toast.success(
      selectedAction === "concluir"
        ? "Solicitação concluída com sucesso!"
        : selectedAction === "assumir"
        ? "Você assumiu esta solicitação!"
        : "Atualização registrada com sucesso!"
    )
    setNewComment("")
    setSelectedAction("")
  }

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Solicitações", href: "/solicitacoes" },
          { label: task.title.length > 40 ? task.title.substring(0, 40) + "..." : task.title },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/solicitacoes">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                {getStatusIcon(task.status)}
                <h1 className="text-2xl font-bold text-foreground">{task.title}</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Criada por <span className="font-medium text-foreground">{task.requesterName}</span> ({task.requesterRole}) · {formatRelativeTime(task.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content - Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="size-4" />
                  Descrição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{task.description}</p>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Histórico de Atividades
                </CardTitle>
                <CardDescription>
                  {task.activities.length} atividade(s) registrada(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

                  <div className="space-y-6">
                    {task.activities.map((activity) => (
                      <div key={activity.id} className="relative flex gap-4">
                        {/* Timeline dot */}
                        <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border bg-background">
                          {getActivityIcon(activity.action)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Avatar className="size-5">
                              <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                                {getInitials(activity.userName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{activity.userName}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{activity.action}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
                          {activity.attachment && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              <Image className="size-3.5" />
                              <span className="underline">Evidência anexada</span>
                            </div>
                          )}
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {formatDateTime(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Form */}
            {isActive && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Send className="size-4" />
                    Registrar Atividade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Select value={selectedAction} onValueChange={setSelectedAction}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de ação" />
                        </SelectTrigger>
                        <SelectContent>
                          {task.status === "Aberta" && (
                            <SelectItem value="assumir">Assumir solicitação</SelectItem>
                          )}
                          <SelectItem value="atualizar">Atualizar progresso</SelectItem>
                          <SelectItem value="concluir">Concluir solicitação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder="Descreva o que foi feito ou observado..."
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" disabled>
                        <Image className="mr-2 size-4" />
                        Anexar evidência
                      </Button>
                      <Button onClick={handleSubmitAction} disabled={!newComment.trim()}>
                        <Send className="mr-2 size-4" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar info */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detalhes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(task.status)}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Prioridade</span>
                  {getPriorityBadge(task.priority)}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Categoria</span>
                  <Badge variant="outline">{task.category}</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Laboratório(s)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {task.laboratories.map((lab) => (
                      <Badge key={lab} variant="outline" className="text-xs">
                        <FlaskConical className="mr-1 size-3" />
                        {lab === "Laboratório de Física" ? "Física" : "Robótica"}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requester */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="size-4" />
                  Solicitante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(task.requesterName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{task.requesterName}</p>
                    <p className="text-xs text-muted-foreground">{task.requesterRole}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignees */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <UserPlus className="size-4" />
                  Responsáveis
                  {task.assignees.length > 0 && (
                    <Badge variant="secondary" className="text-xs">{task.assignees.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {task.assignees.length === 0 ? (
                  <div className="text-center py-4">
                    <AlertCircle className="size-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhum monitor assumiu esta solicitação ainda.</p>
                    {isActive && (
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.success("Você assumiu esta solicitação!")}>
                        <UserPlus className="mr-2 size-4" />
                        Assumir
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {task.assignees.map((assignee) => (
                      <div key={assignee.userId} className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs bg-success/15 text-success">
                            {getInitials(assignee.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{assignee.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            Assumiu {formatRelativeTime(assignee.assignedAt)}
                          </p>
                        </div>
                        {assignee.completedAt ? (
                          <CheckCircle2 className="size-4 text-success shrink-0" />
                        ) : (
                          <Loader2 className="size-4 text-warning shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarClock className="size-4" />
                  Cronologia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Criada em</p>
                    <p className="text-sm font-medium">{formatDateTime(task.createdAt)}</p>
                  </div>
                </div>
                {task.assignees.length > 0 && (
                  <div className="flex items-center gap-2">
                    <UserPlus className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Primeiro atendimento</p>
                      <p className="text-sm font-medium">
                        {formatDateTime(task.assignees[0].assignedAt)}
                      </p>
                    </div>
                  </div>
                )}
                {task.completedAt && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success" />
                    <div>
                      <p className="text-xs text-muted-foreground">Concluída em</p>
                      <p className="text-sm font-medium">{formatDateTime(task.completedAt)}</p>
                    </div>
                  </div>
                )}
                {totalDuration && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <CalendarClock className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tempo total</p>
                        <p className="text-sm font-medium">{totalDuration}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
