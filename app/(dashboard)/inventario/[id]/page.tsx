"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  Wrench,
  History,
  ClipboardList,
  Package,
  MapPin,
  User,
  Calendar,
  DollarSign,
  AlertTriangle,
  FileText,
  ImageIcon,
} from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getItemById, mockAuditLogs, mockLoans, mockMaintenances } from "@/lib/mock-data"

function getStatusBadge(status: string) {
  switch (status) {
    case "Em uso":
      return <Badge className="bg-success/15 text-success border-success/30">Em uso</Badge>
    case "Reserva":
      return <Badge variant="secondary">Reserva</Badge>
    case "Emprestado":
      return <Badge className="bg-warning/15 text-warning border-warning/30">Emprestado</Badge>
    case "Em manutenção":
      return <Badge className="bg-info/15 text-info border-info/30">Em manutenção</Badge>
    case "Em calibração":
      return <Badge className="bg-info/15 text-info border-info/30">Em calibração</Badge>
    case "Desativado":
      return <Badge variant="outline" className="text-muted-foreground">Desativado</Badge>
    case "Para descarte":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30">Para descarte</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getConservationBadge(state: string) {
  switch (state) {
    case "Ótimo":
    case "Bom":
      return <Badge className="bg-success/15 text-success border-success/30">{state}</Badge>
    case "Regular":
      return <Badge className="bg-warning/15 text-warning border-warning/30">{state}</Badge>
    case "Ruim":
    case "Inoperante":
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30">{state}</Badge>
    default:
      return <Badge variant="outline">{state}</Badge>
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

function InfoRow({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-start gap-3 py-3">
      {Icon && <Icon className="size-5 text-muted-foreground mt-0.5" />}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const item = getItemById(id)

  if (!item) {
    notFound()
  }

  const itemLogs = mockAuditLogs.filter((log) => log.itemId === id)
  const itemLoans = mockLoans.filter((loan) => loan.itemId === id)
  const itemMaintenances = mockMaintenances.filter((m) => m.itemId === id)

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Inventário", href: "/inventario" },
          { label: item.name },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/inventario">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{item.name}</h1>
                {getStatusBadge(item.usageStatus)}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-mono">{item.internalCode}</span>
                <span>|</span>
                <span>{item.laboratory}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/inventario/${id}/editar`}>
                <Edit className="mr-2 size-4" />
                Editar
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/manutencao/nova?item=${id}`}>
                <Wrench className="mr-2 size-4" />
                Manutenção
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/emprestimos/novo?item=${id}`}>
                <ClipboardList className="mr-2 size-4" />
                Empréstimo
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identification Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="size-5" />
                  Identificação e Classificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Código Interno</p>
                    <p className="font-mono font-medium">{item.internalCode}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Patrimônio</p>
                    <p className="font-mono font-medium">
                      {item.patrimonyNumber === "SEM PATRIMÔNIO" || item.patrimonyNumber === "EM REGULARIZAÇÃO" ? (
                        <Badge variant="outline" className="text-muted-foreground">
                          {item.patrimonyNumber}
                        </Badge>
                      ) : (
                        item.patrimonyNumber
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Marca / Modelo</p>
                    <p className="font-medium">{item.brand} {item.model}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Número de Série</p>
                    <p className="font-mono font-medium">{item.serialNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Quantidade</p>
                    <p className="font-medium">{item.quantity} {item.unit}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Descrição Técnica</p>
                  <p className="text-sm leading-relaxed">{item.technicalDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Location and Responsibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-5" />
                  Localização e Responsabilidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoRow icon={MapPin} label="Laboratório" value={item.laboratory} />
                  <InfoRow icon={MapPin} label="Localização Específica" value={item.location} />
                  <InfoRow icon={User} label="Responsável" value={item.responsible} />
                  <InfoRow
                    icon={FileText}
                    label="Projeto Vinculado"
                    value={item.linkedProject || "Nenhum projeto vinculado"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Condition and Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5" />
                  Estado e Condição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Estado de Conservação</p>
                    {getConservationBadge(item.conservationState)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Condição de Funcionamento</p>
                    <p className="font-medium">{item.operatingCondition}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Situação de Uso</p>
                    {getStatusBadge(item.usageStatus)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Criticidade</p>
                    {getCriticalityBadge(item.criticality)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Necessidade de Manutenção</p>
                    <Badge
                      variant={item.maintenanceNeed === "Sim" ? "destructive" : "secondary"}
                      className={item.maintenanceNeed === "Sim" ? "bg-destructive/15 text-destructive border-destructive/30" : ""}
                    >
                      {item.maintenanceNeed}
                    </Badge>
                  </div>
                </div>
                {item.observations && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Observações</p>
                      <p className="text-sm leading-relaxed">{item.observations}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tabs for History */}
            <Card>
              <CardHeader className="pb-0">
                <Tabs defaultValue="history" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                    <TabsTrigger value="loans">Empréstimos</TabsTrigger>
                    <TabsTrigger value="maintenance">Manutenções</TabsTrigger>
                  </TabsList>

                  <TabsContent value="history" className="mt-4">
                    <CardDescription className="mb-4">
                      Timeline de alterações e movimentações do item
                    </CardDescription>
                    {itemLogs.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8">
                        <History className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Nenhum registro encontrado</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {itemLogs.map((log) => (
                          <div key={log.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                            <div className="mt-1.5 size-2 rounded-full bg-primary" />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{log.action}</p>
                                <Badge variant="outline" className="text-xs">
                                  {log.itemCode}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{log.details}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                por {log.userName}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="loans" className="mt-4">
                    <CardDescription className="mb-4">
                      Histórico de empréstimos deste item
                    </CardDescription>
                    {itemLoans.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8">
                        <ClipboardList className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Nenhum empréstimo registrado</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {itemLoans.map((loan) => (
                            <TableRow key={loan.id}>
                              <TableCell className="font-medium">{loan.requesterName}</TableCell>
                              <TableCell>{loan.quantityBorrowed}</TableCell>
                              <TableCell>
                                {new Date(loan.withdrawalDate).toLocaleDateString("pt-BR")}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={loan.status === "Devolvido" ? "secondary" : "outline"}
                                  className={
                                    loan.status === "Atrasado"
                                      ? "bg-destructive/15 text-destructive border-destructive/30"
                                      : loan.status === "Ativo"
                                        ? "bg-success/15 text-success border-success/30"
                                        : ""
                                  }
                                >
                                  {loan.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>

                  <TabsContent value="maintenance" className="mt-4">
                    <CardDescription className="mb-4">
                      Histórico de manutenções deste item
                    </CardDescription>
                    {itemMaintenances.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8">
                        <Wrench className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Nenhuma manutenção registrada</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Problema</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {itemMaintenances.map((m) => (
                            <TableRow key={m.id}>
                              <TableCell className="font-medium">{m.maintenanceType}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{m.reportedProblem}</TableCell>
                              <TableCell>
                                {new Date(m.openingDate).toLocaleDateString("pt-BR")}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={m.status === "Concluída" ? "secondary" : "outline"}
                                  className={
                                    m.status === "Aberta"
                                      ? "bg-warning/15 text-warning border-warning/30"
                                      : m.status === "Em andamento"
                                        ? "bg-info/15 text-info border-info/30"
                                        : ""
                                  }
                                >
                                  {m.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                </Tabs>
              </CardHeader>
              <CardContent className="pt-0" />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="size-5" />
                  Foto do Item
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="size-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Sem foto disponível</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acquisition Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="size-5" />
                  Aquisição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Data de Aquisição</p>
                  <p className="font-medium">
                    {item.acquisitionDate === "DESCONHECIDA"
                      ? item.acquisitionDate
                      : new Date(item.acquisitionDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Valor de Aquisição</p>
                  <p className="font-medium">{item.acquisitionValue}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Fonte de Recurso</p>
                  <Badge variant="outline">{item.fundingSource}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5" />
                  Manutenção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Última Manutenção</p>
                  <p className="font-medium">
                    {item.lastMaintenance
                      ? new Date(item.lastMaintenance).toLocaleDateString("pt-BR")
                      : "Não registrada"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Próxima Manutenção</p>
                  <p className="font-medium">
                    {item.nextMaintenance
                      ? new Date(item.nextMaintenance).toLocaleDateString("pt-BR")
                      : "Não programada"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/inventario/${id}/editar`}>
                    <Edit className="mr-2 size-4" />
                    Editar Cadastro
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/emprestimos/novo?item=${id}`}>
                    <ClipboardList className="mr-2 size-4" />
                    Registrar Empréstimo
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/manutencao/nova?item=${id}`}>
                    <Wrench className="mr-2 size-4" />
                    Registrar Manutenção
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/auditoria?item=${id}`}>
                    <History className="mr-2 size-4" />
                    Ver Histórico Completo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium">Criado em:</span>{" "}
                    {new Date(item.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>
                    <span className="font-medium">Última atualização:</span>{" "}
                    {new Date(item.updatedAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
