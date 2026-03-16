"use client"

import Link from "next/link"
import {
  Package,
  PackageCheck,
  PackageX,
  Clock,
  Wrench,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity,
} from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockDashboardStats, mockItems, mockLoans, mockMaintenances, mockAuditLogs } from "@/lib/mock-data"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

const kpiCards = [
  {
    title: "Total de Itens",
    value: mockDashboardStats.totalItems,
    description: "Cadastrados no sistema",
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Em Uso",
    value: mockDashboardStats.inUse,
    description: "Itens ativos em operação",
    icon: PackageCheck,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Emprestados",
    value: mockDashboardStats.borrowed,
    description: "Aguardando devolução",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Em Manutenção",
    value: mockDashboardStats.inMaintenance,
    description: "Itens em reparo",
    icon: Wrench,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    title: "Alta Criticidade",
    value: mockDashboardStats.highCriticality,
    description: "Itens críticos monitorados",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Sem Patrimônio",
    value: mockDashboardStats.withoutPatrimony,
    description: "Aguardando regularização",
    icon: PackageX,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
]

const categoryData = [
  { name: "Medição", value: 5, fill: "var(--color-chart-1)" },
  { name: "Automação", value: 4, fill: "var(--color-chart-2)" },
  { name: "Kit Didático", value: 2, fill: "var(--color-chart-3)" },
  { name: "Robótica", value: 3, fill: "var(--color-chart-4)" },
  { name: "Ferramentas", value: 2, fill: "var(--color-chart-5)" },
]

const labData = [
  { name: "Lab. Física", items: 8, fill: "var(--color-chart-1)" },
  { name: "Lab. Robótica", items: 8, fill: "var(--color-chart-2)" },
]

function getStatusBadge(status: string) {
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

export default function DashboardPage() {
  const overdueLoans = mockLoans.filter((l) => l.status === "Atrasado")
  const activeMaintenances = mockMaintenances.filter((m) => m.status !== "Concluída")
  const criticalItems = mockItems.filter((i) => i.criticality === "Crítica" || i.criticality === "Alta")
  const recentActivity = mockAuditLogs.slice(0, 5)

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Dashboard" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral do inventário dos laboratórios acadêmicos
            </p>
          </div>
          <Button asChild>
            <Link href="/inventario/novo">
              <Package className="mr-2 size-4" />
              Novo Item
            </Link>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`rounded-md p-2 ${kpi.bgColor}`}>
                  <kpi.icon className={`size-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Items by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5" />
                Itens por Categoria
              </CardTitle>
              <CardDescription>
                Distribuição do inventário por tipo de equipamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--color-muted)' }}
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Items by Laboratory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-5" />
                Itens por Laboratório
              </CardTitle>
              <CardDescription>
                Distribuição de equipamentos entre os laboratórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={labData} margin={{ left: 0, right: 20, top: 20, bottom: 20 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: 'var(--color-muted)' }}
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="items" radius={[4, 4, 0, 0]} barSize={80}>
                      {labData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Tables Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Overdue Loans */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="size-5" />
                  Empréstimos em Atraso
                </CardTitle>
                <CardDescription>Itens que precisam ser devolvidos</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/emprestimos">
                  Ver todos
                  <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {overdueLoans.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum empréstimo em atraso
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Solicitante</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.itemName}</TableCell>
                        <TableCell>{loan.requesterName}</TableCell>
                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Pending Maintenances */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="size-5" />
                  Manutenções Pendentes
                </CardTitle>
                <CardDescription>Ordens de serviço em aberto</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/manutencao">
                  Ver todos
                  <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activeMaintenances.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma manutenção pendente
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeMaintenances.slice(0, 4).map((maintenance) => (
                      <TableRow key={maintenance.id}>
                        <TableCell className="font-medium">{maintenance.itemName}</TableCell>
                        <TableCell>{maintenance.maintenanceType}</TableCell>
                        <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Critical Items and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Critical Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Itens Críticos</CardTitle>
                <CardDescription>Equipamentos de alta criticidade</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/inventario?criticidade=alta">
                  Ver todos
                  <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Criticidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criticalItems.slice(0, 5).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.internalCode}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{getCriticalityBadge(item.criticality)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas alterações no sistema</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auditoria">
                  Ver histórico
                  <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="mt-1 size-2 rounded-full bg-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {log.action} - {log.itemCode}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        - {log.userName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
