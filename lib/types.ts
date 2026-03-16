// USCS Laboratory Inventory Management System - Type Definitions

export type ItemCategory =
  | "Equipamento de medição"
  | "Equipamento de informática"
  | "Equipamento de automação"
  | "Equipamento de robótica"
  | "Equipamento de fabricação digital"
  | "Ferramenta técnica"
  | "Kit didático"
  | "Mobiliário técnico"
  | "Consumível técnico"
  | "EPI"

export type ConservationState = "Ótimo" | "Bom" | "Regular" | "Ruim" | "Inoperante"

export type OperatingCondition =
  | "Funcionando"
  | "Funcionando parcialmente"
  | "Não testado"
  | "Não funciona"
  | "Em manutenção"
  | "Obsoleto"

export type UsageStatus =
  | "Disponível"
  | "Em uso"
  | "Reserva"
  | "Emprestado"
  | "Em manutenção"
  | "Em calibração"
  | "Desativado"
  | "Para descarte"

export type MaintenanceNeed = "Sim" | "Não" | "Avaliar"

export type Criticality = "Baixa" | "Média" | "Alta" | "Crítica"

export type FundingSource =
  | "FINEP"
  | "FAPESP"
  | "CAPES"
  | "Recurso próprio"
  | "Doação"
  | "Convênio"
  | "Outro"

export type Laboratory = "Laboratório de Física" | "Laboratório de Robótica"

export type Unit = "Unidade" | "Kit" | "Conjunto" | "Caixa" | "Peça" | "Metro"

export interface InventoryItem {
  id: string
  internalCode: string
  patrimonyNumber: string
  name: string
  technicalDescription: string
  category: ItemCategory
  brand: string
  model: string
  serialNumber: string
  quantity: number
  unit: Unit
  location: string
  laboratory: Laboratory
  responsible: string
  conservationState: ConservationState
  operatingCondition: OperatingCondition
  acquisitionDate: string
  acquisitionValue: string
  usageStatus: UsageStatus
  maintenanceNeed: MaintenanceNeed
  observations: string
  criticality: Criticality
  lastMaintenance: string | null
  nextMaintenance: string | null
  linkedProject: string
  fundingSource: FundingSource
  photos: string[]
  createdAt: string
  updatedAt: string
}

export type LoanUserType = "Aluno" | "Professor" | "Monitor" | "Técnico"

export type LoanStatus = "Ativo" | "Devolvido" | "Atrasado" | "Pendente de aprovação"

export interface Loan {
  id: string
  itemId: string
  itemCode: string
  itemName: string
  requesterName: string
  userType: LoanUserType
  identification: string
  quantityBorrowed: number
  originLab: Laboratory
  purpose: string
  withdrawalDate: string
  expectedReturnDate: string
  actualReturnDate: string | null
  deliveryResponsible: string
  receivingResponsible: string | null
  observations: string
  status: LoanStatus
  createdAt: string
}

export type MaintenanceType =
  | "Preventiva"
  | "Corretiva"
  | "Calibração"
  | "Inspeção"
  | "Avaliação técnica"

export type MaintenanceStatus =
  | "Aberta"
  | "Em andamento"
  | "Concluída"
  | "Aguardando peça"
  | "Terceirizada"

export interface Maintenance {
  id: string
  itemId: string
  itemCode: string
  itemName: string
  category: ItemCategory
  reportedProblem: string
  maintenanceType: MaintenanceType
  responsible: string
  supplierOrTechnician: string
  openingDate: string
  lastMaintenance: string | null
  nextMaintenance: string | null
  estimatedCost: string
  status: MaintenanceStatus
  criticality: Criticality
  observations: string
  createdAt: string
  completedAt: string | null
}

export type AuditActionType =
  | "Criação"
  | "Edição"
  | "Alteração de localização"
  | "Mudança de responsável"
  | "Alteração de estado"
  | "Alteração de condição"
  | "Empréstimo"
  | "Devolução"
  | "Manutenção"
  | "Anexo adicionado"
  | "Mudança de situação"

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: AuditActionType
  itemId: string
  itemCode: string
  laboratory: Laboratory
  details: string
}

export type UserRole =
  | "Administrador"
  | "Monitor"
  | "Professor"
  | "Técnico/Laboratorista"
  | "Visualizador"

export type UserStatus = "Ativo" | "Inativo"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  linkedLaboratory: Laboratory | "Todos"
  status: UserStatus
  lastAccess: string
  createdAt: string
}

// Lab Map Types
export type MapElementType =
  | "wall"
  | "table"
  | "cabinet"
  | "door"
  | "window"
  | "equipment"
  | "electrical-panel"
  | "chair"
  | "label"

export interface MapElement {
  id: string
  type: MapElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  label?: string
  linkedItemId?: string
  color?: string
}

export interface LabMap {
  id: string
  laboratory: Laboratory
  name: string
  width: number
  height: number
  elements: MapElement[]
  createdAt: string
  updatedAt: string
}

// Dashboard KPIs
export interface DashboardStats {
  totalItems: number
  inUse: number
  inReserve: number
  borrowed: number
  inMaintenance: number
  inCalibration: number
  deactivated: number
  forDisposal: number
  highCriticality: number
  upcomingMaintenance: number
  withoutPatrimony: number
  recentMovements: number
}
