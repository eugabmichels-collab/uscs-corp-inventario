"use client"

import {
  Settings,
  User,
  Shield,
  Bell,
  Key,
  Mail,
  Building2,
  Clock,
} from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PerfilPage() {
  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Meu Perfil" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <Card className="lg:col-span-1">
            <CardContent className="flex flex-col items-center pt-6">
              <Avatar className="size-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  AD
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-lg font-semibold">Administrador do Sistema</h2>
              <p className="text-sm text-muted-foreground">admin@uscs.edu.br</p>
              <Badge className="mt-2 bg-destructive/15 text-destructive border-destructive/30">
                Administrador
              </Badge>

              <Separator className="my-6" />

              <div className="w-full space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Laboratório</p>
                    <p className="text-sm">Todos os laboratórios</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Último acesso</p>
                    <p className="text-sm">12/03/2024 14:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Membro desde</p>
                    <p className="text-sm">01/01/2020</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="size-5 text-muted-foreground" />
                  <div>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Atualize seus dados pessoais</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input id="fullName" defaultValue="Administrador do Sistema" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" defaultValue="admin@uscs.edu.br" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input id="department" defaultValue="Coordenação de Laboratórios" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="size-5 text-muted-foreground" />
                  <div>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>Altere sua senha de acesso</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova senha</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline">Alterar Senha</Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="size-5 text-muted-foreground" />
                  <div>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>Configure suas preferências de notificação</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Empréstimos atrasados</p>
                    <p className="text-xs text-muted-foreground">Receber alerta quando um empréstimo ultrapassar a data prevista</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Manutenções pendentes</p>
                    <p className="text-xs text-muted-foreground">Alerta sobre ordens de serviço abertas ou aguardando peça</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Calibrações programadas</p>
                    <p className="text-xs text-muted-foreground">Lembrete de calibrações próximas do vencimento</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Notificações por e-mail</p>
                    <p className="text-xs text-muted-foreground">Receber cópia das notificações por e-mail</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
