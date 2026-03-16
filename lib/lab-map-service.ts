import type { LabMap } from "./types"
import { mockLabMaps } from "./mock-data"

// ============================================================================
// Lab Map Service
// ============================================================================
//
// Camada de serviço para gerenciamento das plantas dos laboratórios.
// Atualmente persiste no localStorage como solução temporária.
//
// TODO [Backend]: Substituir cada função abaixo pela chamada real à API.
// Exemplo de endpoints esperados:
//
//   GET    /api/lab-maps?laboratory=Laboratório+de+Robótica
//   GET    /api/lab-maps/:id
//   POST   /api/lab-maps          { body: LabMap }
//   PUT    /api/lab-maps/:id      { body: LabMap }
//   DELETE /api/lab-maps/:id
//
// ============================================================================

const STORAGE_KEY = "uscs-lab-maps"

/**
 * Carrega todas as plantas do localStorage.
 * Se não houver dados salvos, inicializa com os dados mock.
 */
function loadMaps(): LabMap[] {
  if (typeof window === "undefined") return mockLabMaps

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as LabMap[]
    } catch {
      // Dados corrompidos — reinicializa com mock
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Primeira execução: salva os dados mock no localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLabMaps))
  return mockLabMaps
}

function persistMaps(maps: LabMap[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(maps))
}

// ============================================================================
// API Pública
// ============================================================================

/**
 * Busca a planta de um laboratório específico.
 *
 * TODO [Backend]:
 *   const res = await fetch(`/api/lab-maps?laboratory=${encodeURIComponent(laboratory)}`)
 *   return res.ok ? (await res.json()) as LabMap : undefined
 */
export function getLabMapByLab(laboratory: string): LabMap | undefined {
  const maps = loadMaps()
  return maps.find((m) => m.laboratory === laboratory)
}

/**
 * Busca uma planta pelo ID.
 *
 * TODO [Backend]:
 *   const res = await fetch(`/api/lab-maps/${id}`)
 *   return res.ok ? (await res.json()) as LabMap : undefined
 */
export function getLabMapById(id: string): LabMap | undefined {
  const maps = loadMaps()
  return maps.find((m) => m.id === id)
}

/**
 * Salva (cria ou atualiza) uma planta de laboratório.
 * Retorna a planta atualizada.
 *
 * TODO [Backend]:
 *   const method = existingMap ? "PUT" : "POST"
 *   const url = existingMap ? `/api/lab-maps/${map.id}` : "/api/lab-maps"
 *   const res = await fetch(url, {
 *     method,
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(map),
 *   })
 *   if (!res.ok) throw new Error("Falha ao salvar planta")
 *   return (await res.json()) as LabMap
 */
export function saveLabMap(map: LabMap): LabMap {
  const maps = loadMaps()
  const index = maps.findIndex((m) => m.id === map.id)

  const updatedMap: LabMap = {
    ...map,
    updatedAt: new Date().toISOString(),
  }

  if (index >= 0) {
    maps[index] = updatedMap
  } else {
    updatedMap.createdAt = new Date().toISOString()
    maps.push(updatedMap)
  }

  persistMaps(maps)
  return updatedMap
}

/**
 * Remove uma planta de laboratório.
 *
 * TODO [Backend]:
 *   const res = await fetch(`/api/lab-maps/${id}`, { method: "DELETE" })
 *   if (!res.ok) throw new Error("Falha ao remover planta")
 */
export function deleteLabMap(id: string): void {
  const maps = loadMaps()
  const filtered = maps.filter((m) => m.id !== id)
  persistMaps(filtered)
}

/**
 * Reseta os dados para o estado inicial (mock).
 * Útil para desenvolvimento/testes.
 */
export function resetLabMaps(): void {
  localStorage.removeItem(STORAGE_KEY)
}
