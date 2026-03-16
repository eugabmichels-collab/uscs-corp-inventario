"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:60px_60px]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur">
              <GraduationCap className="size-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold">USCS</h2>
              <p className="text-sm text-primary-foreground/80">
                Universidade Municipal de São Caetano do Sul
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold leading-tight text-balance">
                Sistema de Inventário de Laboratórios Acadêmicos
              </h1>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-md">
                Gestão patrimonial, rastreabilidade e controle operacional dos
                laboratórios de Física e Robótica.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="rounded-lg bg-primary-foreground/10 p-4 backdrop-blur">
                <p className="text-3xl font-bold">250+</p>
                <p className="text-sm text-primary-foreground/80">Itens cadastrados</p>
              </div>
              <div className="rounded-lg bg-primary-foreground/10 p-4 backdrop-blur">
                <p className="text-3xl font-bold">2</p>
                <p className="text-sm text-primary-foreground/80">Laboratórios</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-primary-foreground/60">
            Coordenação de Engenharia - Monitoria Universitária
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="size-7" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground">USCS</h2>
            <p className="text-sm text-muted-foreground">
              Universidade Municipal de São Caetano do Sul
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-center">
                Acesso ao Sistema
              </CardTitle>
              <CardDescription className="text-center">
                Sistema de Inventário de Laboratórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail institucional</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@uscs.edu.br"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Ocultar senha" : "Mostrar senha"}
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Lembrar meu acesso neste dispositivo
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar no Sistema"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  Acesso restrito a usuários autorizados da USCS.
                  <br />
                  Em caso de problemas, contate o suporte técnico.
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Sistema desenvolvido pela Coordenação de Engenharia
            <br />
            USCS - Universidade Municipal de São Caetano do Sul
          </p>
        </div>
      </div>
    </div>
  )
}
