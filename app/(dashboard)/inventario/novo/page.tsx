"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Info,
  Upload,
  X,
  ImageIcon,
} from "lucide-react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const categories = [
  "Equipamento de medição",
  "Equipamento de informática",
  "Equipamento de automação",
  "Equipamento de robótica",
  "Equipamento de fabricação digital",
  "Ferramenta técnica",
  "Kit didático",
  "Mobiliário técnico",
  "Consumível técnico",
  "EPI",
]

const laboratories = ["Laboratório de Física", "Laboratório de Robótica"]
const units = ["Unidade", "Kit", "Conjunto", "Caixa", "Peça", "Metro"]
const conservationStates = ["Ótimo", "Bom", "Regular", "Ruim", "Inoperante"]
const operatingConditions = [
  "Funcionando",
  "Funcionando parcialmente",
  "Não testado",
  "Não funciona",
  "Em manutenção",
  "Obsoleto",
]
const usageStatuses = [
  "Em uso",
  "Reserva",
  "Emprestado",
  "Em manutenção",
  "Em calibração",
  "Desativado",
  "Para descarte",
]
const maintenanceNeeds = ["Sim", "Não", "Avaliar"]
const criticalities = ["Baixa", "Média", "Alta", "Crítica"]
const fundingSources = [
  "FINEP",
  "FAPESP",
  "CAPES",
  "Recurso próprio",
  "Doação",
  "Convênio",
  "Outro",
]

interface FieldWithTooltipProps {
  label: string
  tooltip: string
  required?: boolean
  children: React.ReactNode
}

function FieldWithTooltip({ label, tooltip, required, children }: FieldWithTooltipProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
          {label}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
    </div>
  )
}

export default function NewItemPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      toast.success("Item cadastrado com sucesso!", {
        description: "O item foi adicionado ao inventário.",
      })
      router.push("/inventario")
    }, 1500)
  }

  const handlePhotoUpload = () => {
    // Simulate photo upload
    setPhotos([...photos, `/placeholder-${photos.length + 1}.jpg`])
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Sistema", href: "/dashboard" },
          { label: "Inventário", href: "/inventario" },
          { label: "Novo Item" },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/inventario">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Novo Item</h1>
              <p className="text-muted-foreground">
                Cadastro de novo item no inventário patrimonial
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identificação */}
          <Card>
            <CardHeader>
              <CardTitle>Identificação do Item</CardTitle>
              <CardDescription>
                Informações básicas de identificação e rastreabilidade
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FieldWithTooltip
                label="Código Interno"
                tooltip="Identificador único do inventário. Estrutura sugerida: LAB + área + tipo + número sequencial (ex: LAB-FIS-EQ-001, LAB-ROB-KIT-014)"
                required
              >
                <Input placeholder="LAB-FIS-EQ-001" required />
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Número de Patrimônio"
                tooltip="Aceitar: número patrimonial institucional, SEM PATRIMÔNIO ou EM REGULARIZAÇÃO"
                required
              >
                <Input placeholder="USCS-2024-0001 ou SEM PATRIMÔNIO" required />
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Nome do Item"
                tooltip="Usar nome técnico + tipo. Exemplos: Osciloscópio digital, Multímetro digital, Kit Arduino educacional"
                required
              >
                <Input placeholder="Osciloscópio Digital 100MHz" required />
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Número de Série"
                tooltip="Se não existir: NÃO POSSUI. Se ilegível: ILEGÍVEL"
              >
                <Input placeholder="SN123456789 ou NÃO POSSUI" />
              </FieldWithTooltip>

              <div className="md:col-span-2">
                <FieldWithTooltip
                  label="Descrição Técnica"
                  tooltip="Descrever tipo, função, características principais e especificações relevantes"
                  required
                >
                  <Textarea
                    placeholder="Osciloscópio digital de 2 canais, largura de banda 100MHz, taxa de amostragem 1GSa/s, tela LCD 7 polegadas..."
                    className="min-h-[100px]"
                    required
                  />
                </FieldWithTooltip>
              </div>
            </CardContent>
          </Card>

          {/* Classificação */}
          <Card>
            <CardHeader>
              <CardTitle>Classificação</CardTitle>
              <CardDescription>
                Categoria, marca, modelo e demais informações de classificação
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FieldWithTooltip
                label="Categoria"
                tooltip="Tipo de equipamento conforme classificação institucional"
                required
              >
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Marca"
                tooltip="Se não houver marca identificada: GENÉRICO"
              >
                <Input placeholder="Tektronix, Fluke, Arduino..." />
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Modelo"
                tooltip="Se não houver modelo identificado: NÃO IDENTIFICADO"
              >
                <Input placeholder="TBS1102C, 117, Uno R3..." />
              </FieldWithTooltip>
            </CardContent>
          </Card>

          {/* Quantidade e Localização */}
          <Card>
            <CardHeader>
              <CardTitle>Quantidade e Localização</CardTitle>
              <CardDescription>
                Controle quantitativo e localização física do item
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <FieldWithTooltip
                label="Quantidade"
                tooltip="Número de unidades do item"
                required
              >
                <Input type="number" min="1" defaultValue="1" required />
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Unidade"
                tooltip="Tipo de contagem do item"
                required
              >
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Laboratório"
                tooltip="Laboratório onde o item está alocado"
                required
              >
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {laboratories.map((lab) => (
                      <SelectItem key={lab} value={lab}>
                        {lab}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Localização Específica"
                tooltip="Formato: laboratório + área + posição (ex: Lab Física - Bancada 3)"
                required
              >
                <Input placeholder="Bancada 3, Armário A..." required />
              </FieldWithTooltip>

              <div className="md:col-span-2 lg:col-span-4">
                <FieldWithTooltip
                  label="Responsável"
                  tooltip="Nunca deixar vazio. Exemplos: Coordenação Engenharia, Monitor laboratório, Prof. responsável"
                  required
                >
                  <Input placeholder="Prof. Dr. Carlos Silva" required />
                </FieldWithTooltip>
              </div>
            </CardContent>
          </Card>

          {/* Estado e Operação */}
          <Card>
            <CardHeader>
              <CardTitle>Estado e Funcionamento</CardTitle>
              <CardDescription>
                Condição atual do item e situação de uso
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FieldWithTooltip
                label="Estado de Conservação"
                tooltip="Condição física do equipamento"
                required
              >
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {conservationStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Condição de Funcionamento"
                tooltip="Status operacional do equipamento"
                required
              >
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {operatingConditions.map((cond) => (
                      <SelectItem key={cond} value={cond}>
                        {cond}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Situação de Uso"
                tooltip="Estado atual de utilização do item"
                required
              >
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {usageStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Necessidade de Manutenção"
                tooltip="Indicar se o item precisa de manutenção"
                required
              >
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenanceNeeds.map((need) => (
                      <SelectItem key={need} value={need}>
                        {need}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Criticidade"
                tooltip="Nível de importância do item para as operações do laboratório"
                required
              >
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {criticalities.map((crit) => (
                      <SelectItem key={crit} value={crit}>
                        {crit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWithTooltip>
            </CardContent>
          </Card>

          {/* Aquisição e Valor */}
          <Card>
            <CardHeader>
              <CardTitle>Aquisição e Valor</CardTitle>
              <CardDescription>
                Informações sobre aquisição, valor e fonte de recurso
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FieldWithTooltip
                label="Data de Aquisição"
                tooltip="Aceitar: data exata, DESCONHECIDA ou Aproximadamente 2022"
              >
                <Input type="date" />
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Valor de Aquisição"
                tooltip="Aceitar: valor numérico, valor estimado ou NÃO INFORMADO"
              >
                <Input placeholder="R$ 4.500,00 ou NÃO INFORMADO" />
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Fonte de Recurso"
                tooltip="Origem do financiamento para aquisição do item"
              >
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {fundingSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWithTooltip>
            </CardContent>
          </Card>

          {/* Manutenção e Projeto */}
          <Card>
            <CardHeader>
              <CardTitle>Manutenção e Projeto Vinculado</CardTitle>
              <CardDescription>
                Informações de manutenção e vínculo com projetos acadêmicos
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FieldWithTooltip
                label="Última Manutenção"
                tooltip="Data da última manutenção realizada"
              >
                <Input type="date" />
              </FieldWithTooltip>

              <FieldWithTooltip
                label="Próxima Manutenção"
                tooltip="Data prevista para próxima manutenção"
              >
                <Input type="date" />
              </FieldWithTooltip>

              <div className="md:col-span-2">
                <FieldWithTooltip
                  label="Projeto Vinculado"
                  tooltip="Exemplos: Projeto de extensão, Iniciação científica, Aula prática de robótica"
                >
                  <Input placeholder="Projeto de extensão em instrumentação" />
                </FieldWithTooltip>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
              <CardDescription>
                Informações adicionais relevantes sobre o item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldWithTooltip
                label="Observações"
                tooltip="Exemplos: Faltando cabo, Sem fonte original, Tela danificada, Precisa calibração"
              >
                <Textarea
                  placeholder="Informações adicionais sobre o item..."
                  className="min-h-[100px]"
                />
              </FieldWithTooltip>
            </CardContent>
          </Card>

          {/* Registro Fotográfico */}
          <Card>
            <CardHeader>
              <CardTitle>Registro Fotográfico</CardTitle>
              <CardDescription>
                Fotos do equipamento, etiqueta, número de série e acessórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative group size-32 rounded-lg border bg-muted flex items-center justify-center"
                    >
                      <ImageIcon className="size-8 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="size-32 flex-col gap-2"
                    onClick={handlePhotoUpload}
                  >
                    <Upload className="size-6" />
                    <span className="text-xs">Adicionar Foto</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recomendamos incluir: foto frontal do equipamento, etiqueta patrimonial, número de série e acessórios inclusos.
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/inventario">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 size-4" />
              {isSubmitting ? "Salvando..." : "Cadastrar Item"}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
