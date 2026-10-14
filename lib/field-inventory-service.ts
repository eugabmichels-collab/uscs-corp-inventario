import type {
  InventoryComponent,
  InventoryLab,
  InventoryUnit,
  KitCatalog,
} from "@/lib/types";

const UNITS_KEY = "uscs-field-inventory-units-v1";
const CATALOG_KEY = "uscs-field-inventory-catalog-v1";
const ADMIN_AUDIT_KEY = "uscs-field-inventory-audit-v1";

// A estrutura já aceita o catalogo_kits.csv real. Enquanto ele não é importado,
// estas sementes permitem cadastrar as unidades de Física citadas nas diretrizes.
export const starterCatalog: KitCatalog[] = [
  {
    code: "62001101",
    name: "Plano Inclinado",
    lab: "Fisica",
    area: "Mecanica",
    expectedComponentCount: 20,
    components: [],
  },
  {
    code: "62001027",
    name: "Lançador de Projéteis",
    lab: "Fisica",
    area: "Mecanica",
    expectedComponentCount: 28,
    components: [],
  },
  {
    code: "62001087",
    name: "Mesa de Força",
    lab: "Fisica",
    area: "Mecanica",
    expectedComponentCount: 10,
    components: [],
  },
  {
    code: "62001084",
    name: "Looping com esfera de plástico",
    lab: "Fisica",
    area: "Mecanica",
    expectedComponentCount: 5,
    components: [],
  },
  {
    code: "62001078",
    name: "Força Centrípeta — Dinâmica das Rotações",
    lab: "Fisica",
    area: "Mecanica",
    expectedComponentCount: 49,
    components: [],
  },
  {
    code: "ROB-BRACO",
    name: "Dobot Magician — Braço Robótico",
    lab: "Robotica",
    area: "Robotica",
    manufacturerCode: "1100-BR",
    manufacturer: "Dobot",
    expectedComponentCount: 41,
    components: [],
  },
];

export interface AuditActor {
  name?: string;
  email: string;
  role?: string;
}
export interface AdminAuditEntry {
  id: string;
  action: string;
  createdAt: string;
  actor?: AuditActor;
}

export function demoAuditActor(index: number): AuditActor {
  return index % 2 === 0
    ? {
        name: "Felipe Almeida (Demo)",
        email: "demo.membro6@example.com",
        role: "Administrador",
      }
    : {
        name: "Marcos Almeida (Demo)",
        email: "demo.membro12@example.com",
        role: "Administrador",
      };
}

function currentAuditActor(): AuditActor | undefined {
  try {
    const session = JSON.parse(localStorage.getItem("uscs-session") || "null");
    if (!session?.email) return undefined;
    const members = JSON.parse(localStorage.getItem("uscs-team-v1") || "[]");
    const member = Array.isArray(members)
      ? members.find(
          (entry: { email?: string }) =>
            entry.email?.toLowerCase() === session.email.toLowerCase(),
        )
      : undefined;
    return {
      name: session.name || member?.name,
      email: session.email,
      role: session.role,
    };
  } catch {
    return undefined;
  }
}

function browser() {
  return typeof window !== "undefined";
}

export function getUnits(): InventoryUnit[] {
  if (!browser()) return [];
  try {
    return JSON.parse(
      localStorage.getItem(UNITS_KEY) || "[]",
    ) as InventoryUnit[];
  } catch {
    return [];
  }
}

export function getCatalog(): KitCatalog[] {
  if (!browser()) return starterCatalog;
  try {
    return (
      JSON.parse(localStorage.getItem(CATALOG_KEY) || "null") || starterCatalog
    );
  } catch {
    return starterCatalog;
  }
}

export function saveCatalog(catalog: KitCatalog[]) {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
  addAudit("Catálogo de kits atualizado");
}

export function getAdminAudit(): AdminAuditEntry[] {
  if (!browser()) return [];
  try {
    const entries: AdminAuditEntry[] = JSON.parse(
      localStorage.getItem(ADMIN_AUDIT_KEY) || "[]",
    );
    return entries.map((entry) => {
      const demoIndex = /^DEMO-AUDIT-(\d+)$/.exec(entry.id);
      return !entry.actor && demoIndex
        ? { ...entry, actor: demoAuditActor(Number(demoIndex[1]) - 1) }
        : entry;
    });
  } catch {
    return [];
  }
}

export function addAudit(action: string) {
  if (!browser()) return;
  const entries = getAdminAudit();
  localStorage.setItem(
    ADMIN_AUDIT_KEY,
    JSON.stringify(
      [
        {
          id: crypto.randomUUID(),
          action,
          createdAt: new Date().toISOString(),
          actor: currentAuditActor(),
        },
        ...entries,
      ].slice(0, 500),
    ),
  );
}

function saveUnits(units: InventoryUnit[]) {
  localStorage.setItem(UNITS_KEY, JSON.stringify(units));
}

export function createUnit(input: {
  catalog: KitCatalog;
  unitNumber: string;
  address: string;
  patrimony?: string;
  observations?: string;
}): InventoryUnit {
  const number = input.unitNumber.padStart(2, "0");
  const id = `${input.catalog.code}-U${number}`;
  const current = getUnits();
  if (current.some((unit) => unit.id === id))
    throw new Error(`A unidade ${id} já está cadastrada.`);

  const timestamp = new Date().toISOString();
  const components: InventoryComponent[] = input.catalog.components.map(
    (component) => ({
      ...component,
      unitId: id,
      foundQuantity: null,
      status: "Nao conferido",
    }),
  );
  const unit: InventoryUnit = {
    id,
    lab: input.catalog.lab,
    kitCode: input.catalog.code,
    unitNumber: number,
    kitName: input.catalog.name,
    area: input.catalog.area,
    subarea: input.catalog.subarea,
    address: input.address || "[CONFERIR]",
    patrimony: input.patrimony?.trim() || "SEM ETIQUETA",
    manufacturerCode: input.catalog.manufacturerCode,
    manual: input.catalog.manual || "SEM MANUAL",
    manufacturer: input.catalog.manufacturer,
    status: "Nao conferido",
    observations: input.observations,
    components,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  saveUnits([...current, unit]);
  addAudit(`Unidade física cadastrada · ${unit.id}`);
  return unit;
}

export function updateUnit(updated: InventoryUnit) {
  const units = getUnits().map((unit) =>
    unit.id === updated.id
      ? { ...updated, updatedAt: new Date().toISOString() }
      : unit,
  );
  saveUnits(units);
  addAudit(`Conferência de unidade registrada · ${updated.id}`);
}

export function getUnit(id: string) {
  return getUnits().find((unit) => unit.id === id);
}

export function exportUnits() {
  const blob = new Blob([JSON.stringify(getUnits(), null, 2)], {
    type: "application/json",
  });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = `inventario-uscs-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(href);
}

export function unitLabLabel(lab: InventoryLab) {
  return lab === "Fisica" ? "Laboratório de Física" : "Laboratório de Robótica";
}
