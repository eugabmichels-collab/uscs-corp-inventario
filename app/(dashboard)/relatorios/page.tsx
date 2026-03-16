"use client"

import { useMemo } from "react"
import {
  FileBarChart,
  Download,
  Package,
  Wrench,
  ClipboardList,
  FlaskConical,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { mockItems, mockLoans, mockMaintenances, mockDashboardStats } from "@/lib/mock-data"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts"

export default function RelatoriosPage() {
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    mockItems.forEach((item) => {
      const short = item.category.replace("Equipamento de ", "").replace("Ferramenta ", "")
      counts[short] = (counts[short] || 0) + 1
    })
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      fill: `var(--color-chart-${(i % 5) + 1})`,
    }))
  }, [])

  const statusData = useMemo(() => [
    { name: "Em uso", value: mockDashboardStats.inUse, fill: "var(--color-chart-2)" },
    { name: "Emprestado", value: mockDashboardStats.borrowed, fill: "var(--color-chart-4)" },
    { name: "Manutenção", value: mockDashboardStats.inMaintenance, fill: "var(--color-chart-1)" },
    { name: "Reserva", value: mockDashboardStats.inReserve, fill: "var(--color-chart-3)" },
  ], [])

  const labData = useMemo(() => [
    { name: "Lab. Física", items: mockItems.filter((i) => i.laboratory === "Laboratório de Física").length, fill: "var(--color-chart-1)" },
    { name: "Lab. Robótica", items: mockItems.filter((i) => i.laboratory === "Laboratório de Robótica").length, fill: "var(--color-chart-2)" },
  ], [])

  const conservationData = useMemo(() => {
    const counts: Record<string, number> = {}
    mockItems.forEach((item) => {
      counts[item.conservationState] = (counts[item.conservationState] || 0) + 1
    })
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      fill: `var(--color-chart-${(i % 5) + 1})`,
    }))
  }, [])

  const maintenanceTypeData = useMemo(() => {
    const counts: Record<string, number> = {}
    mockMaintenances.forEach((m) => {
      counts[m.maintenanceType] = (counts[m.maintenanceType] || 0) + 1
    })
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      fill: `var(--color-chart-${(i % 5) + 1})`,
    }))
  }, [])

  const criticalityData = useMemo(() => {
    const counts: Record<string, number> = {}
    mockItems.forEach((item) => {
      counts[item.criticality] = (counts[item.criticality] || 0) + 1
    })
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      fill: `var(--color-chart-${(i % 5) + 1})`,
    }))
  }, [])

  const reports = [
    {
      title: "Inventário Geral",
      description: "Lista completa de todos os itens cadastrados com detalhes",
      icon: Package,
      count: `${mockItems.length} itens`,
    },
    {
      title: "Empréstimos Ativos",
      description: "Relatório de itens emprestados e pendentes de devolução",
      icon: ClipboardList,
      count: `${mockLoans.filter((l) => l.status === "Ativo" || l.status === "Atrasado").length} ativos`,
    },
    {
      title: "Manutenções em Aberto",
      description: "Ordens de serviço pendentes e em andamento",
      icon: Wrench,
      count: `${mockMaintenances.filter((m) => m.status !== "Concluída").length} pendentes`,
    },
    {
      title: "Itens Críticos",
      description: "Equipamentos com alta criticidade que requerem atenção",
      icon: AlertTriangle,
      count: `${mockItems.filter((i) => i.criticality === "Alta" || i.criticality === "Crítica").length} itens`,
    },
    {
      title: "Itens por Laboratório",
      description: "Distribuição de equipamentos entre os laboratórios",
      icon: FlaskConical,
      count: "2 laboratórios",
    },
    {
      title: "Valor Patrimonial",
      description: "Relatório financeiro dos bens patrimoniais inventariados",
      icon: TrendingUp,
      count: "Consolidado",
    },
  ]

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Relatórios" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">
              Visualize e exporte relatórios do sistema de inventário
            </p>
          </div>
        </div>

        {/* Report cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.title} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <report.icon className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <CardDescription className="mt-1">{report.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{report.count}</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 size-3" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Itens por Categoria</CardTitle>
              <CardDescription>Distribuição dos equipamentos por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="text-sm font-medium">{payload[0].payload.name}</div>
                            <div className="text-sm text-muted-foreground">{payload[0].value} item(ns)</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itens por Laboratório</CardTitle>
              <CardDescription>Quantidade de itens em cada laboratório</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={labData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="text-sm font-medium">{payload[0].payload.name}</div>
                            <div className="text-sm text-muted-foreground">{payload[0].value} item(ns)</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="items" radius={[4, 4, 0, 0]}>
                    {labData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de Conservação</CardTitle>
              <CardDescription>Condição dos equipamentos inventariados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={conservationData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="text-sm font-medium">{payload[0].payload.name}</div>
                            <div className="text-sm text-muted-foreground">{payload[0].value} item(ns)</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {conservationData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Criticidade dos Itens</CardTitle>
              <CardDescription>Classificação de criticidade do inventário</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={criticalityData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="text-sm font-medium">{payload[0].payload.name}</div>
                            <div className="text-sm text-muted-foreground">{payload[0].value} item(ns)</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {criticalityData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
