import type {
  InventoryUnit,
  KitCatalog,
  UnitInventoryStatus,
} from "@/lib/types";
import { starterCatalog, demoAuditActor } from "@/lib/field-inventory-service";

const PREFIX = "DEMO-";
const stores = {
  catalog: "uscs-field-inventory-catalog-v1",
  units: "uscs-field-inventory-units-v1",
  team: "uscs-team-v1",
  audit: "uscs-field-inventory-audit-v1",
};

const kitNames = [
  "Plano inclinado",
  "Lançador de projéteis",
  "Mesa de forças",
  "Pêndulo simples",
  "Dinâmica das rotações",
  "Trilhos de ar",
  "Óptica geométrica",
  "Interferência e difração",
  "Circuitos elétricos",
  "Campo magnético",
  "Calorimetria",
  "Ondas e acústica",
  "Braço robótico",
  "Robô seguidor de linha",
  "Automação com Arduino",
  "Sensores industriais",
  "Controle de motores",
  "Esteira automatizada",
  "Visão computacional",
  "Robótica móvel",
  "Internet das coisas",
  "Pneumática didática",
  "Controlador lógico programável",
  "Estação integrada de automação e controle de processos industriais",
];
const firstNames = [
  "Ana",
  "Bruno",
  "Carolina",
  "Daniel",
  "Eduarda",
  "Felipe",
  "Gabriela",
  "Henrique",
  "Isabela",
  "João",
  "Luísa",
  "Marcos",
];
const surnames = ["Almeida", "Santos", "Oliveira", "Costa"];

export function buildDemoData(now = new Date()) {
  const date = (hours: number) =>
    new Date(now.getTime() - hours * 3600000).toISOString();
  const catalog: KitCatalog[] = kitNames.map((name, index) => {
    const robotic = index >= 12;
    const count = 6 + (index % 7);
    return {
      code: `${PREFIX}${robotic ? "ROB" : "FIS"}-${String(index + 1).padStart(3, "0")}`,
      name: `${name} (demonstração)`,
      lab: robotic ? "Robotica" : "Fisica",
      area: robotic
        ? ["Robótica", "Automação", "Eletrônica"][index % 3]
        : ["Mecânica", "Óptica", "Eletricidade", "Termodinâmica"][
            Math.floor(index / 3)
          ],
      manufacturer: "Fabricante fictício",
      manufacturerCode: `MODELO-DEMO-${index + 1}`,
      manual: "SEM MANUAL",
      expectedComponentCount: count,
      components: Array.from({ length: count }, (_, component) => ({
        item: String(component + 1),
        group:
          component === count - 1
            ? "Acessorio opcional"
            : "Composicao principal",
        componentCode: `${PREFIX}COMP-${index + 1}-${component + 1}`,
        description: [
          robotic ? "Módulo controlador" : "Base de sustentação",
          "Cabo de conexão",
          "Suporte ajustável",
          "Conjunto de fixação",
          "Sensor de medição",
          "Adaptador de alimentação",
        ][component % 6],
        expectedQuantity: 1 + (component % 3),
        unitOfMeasure: "UN",
        requirement: "Principal",
      })),
    };
  });
  const statuses: UnitInventoryStatus[] = [
    "Nao conferido",
    "Completo",
    "Completo",
    "Incompleto",
    "Danificado",
    "Indisponivel",
  ];
  const units: InventoryUnit[] = catalog.flatMap((kit, index) =>
    Array.from({ length: 10 }, (_, number) => {
      const status = statuses[(index + number) % statuses.length];
      const unitNumber = String(number + 1).padStart(2, "0");
      const id = `${kit.code}-U${unitNumber}`;
      return {
        id,
        lab: kit.lab,
        kitCode: kit.code,
        unitNumber,
        kitName: kit.name,
        area: kit.area,
        address:
          number === 9
            ? "[CONFERIR]"
            : `Bloco ${kit.lab === "Fisica" ? "A" : "B"} · Sala ${101 + (index % 6)} · Armário ${1 + (number % 4)} · Prateleira ${1 + (number % 3)}`,
        patrimony:
          number % 4 === 0
            ? "SEM ETIQUETA"
            : `DEMO-PAT-${index + 1}-${unitNumber}`,
        manufacturer: kit.manufacturer,
        manufacturerCode: kit.manufacturerCode,
        manual: kit.manual,
        status,
        observations:
          status === "Danificado"
            ? "Demonstração: sensor com conector danificado; aguardando avaliação."
            : status === "Indisponivel"
              ? "Demonstração: unidade reservada para manutenção."
              : "Registro fictício para teste de usabilidade.",
        components: kit.components.map((component, componentIndex) => ({
          ...component,
          unitId: id,
          status:
            status === "Nao conferido"
              ? "Nao conferido"
              : status === "Danificado" && componentIndex === 0
                ? "Danificado"
                : status === "Incompleto" && componentIndex === 1
                  ? "Falta"
                  : "OK",
          foundQuantity:
            status === "Nao conferido"
              ? null
              : status === "Incompleto" && componentIndex === 1
                ? 0
                : component.expectedQuantity,
          observations:
            status === "Incompleto" && componentIndex === 1
              ? "Componente não localizado na conferência fictícia."
              : undefined,
        })),
        createdAt: date(2160 + index * 24),
        updatedAt: date(index * 3 + number),
        verifiedAt:
          status === "Nao conferido" ? undefined : date(index * 3 + number),
        verifiedBy:
          status === "Nao conferido" ? undefined : "Equipe de demonstração",
      };
    }),
  );
  const team = Array.from({ length: 48 }, (_, index) => {
    const status = (
      ["Ativo", "Ativo", "Ativo", "Pendente", "Revogado", "Ativo"] as const
    )[index % 6];
    return {
      id: `${PREFIX}MEMBER-${index + 1}`,
      name: `${firstNames[index % 12]} ${surnames[Math.floor(index / 12)]}${index === 47 ? " de Albuquerque e Vasconcelos" : ""} (Demo)`,
      email: `demo.membro${index + 1}@example.com`,
      role: (
        [
          "Inventariante",
          "Visualizador",
          "Inventariante",
          "Visualizador",
          "Inventariante",
          "Administrador",
        ] as const
      )[index % 6],
      status,
      invitedAt: date(1440 + index * 12),
      createdAt: status === "Pendente" ? undefined : date(1416 + index * 12),
      statusBeforeRevocation: status === "Revogado" ? "Ativo" : undefined,
    };
  });
  const audit = Array.from({ length: 120 }, (_, index) => ({
    id: `${PREFIX}AUDIT-${index + 1}`,
    actor: demoAuditActor(index),
    createdAt: date(index * 4),
    action: `[Demonstração] ${["Catálogo de kits atualizado", "Backup do inventário exportado", "Backup de inventário importado", "Conferência de unidade registrada", "Convite de membro registrado", "Permissões de membro alteradas", "Acesso de membro revogado", "Unidade física cadastrada"][index % 8]} · ${index % 8 < 4 ? units[index % units.length].id : team[index % team.length].name}`,
  }));
  return { catalog, units, team, audit };
}

export function loadDemoData() {
  const data = buildDemoData();
  // Prepare every collection before writing; preserve existing records and demo edits.
  const pending = Object.entries(stores).map(([collection, key]) => {
    const fallback =
      collection === "catalog"
        ? starterCatalog
        : collection === "team"
          ? [
              {
                id: "admin",
                name: "Administrador do Sistema",
                email: "admin@uscs.edu.br",
                role: "Administrador",
                status: "Ativo",
              },
            ]
          : [];
    const current = JSON.parse(
      localStorage.getItem(key) || JSON.stringify(fallback),
    ) as { id?: string; code?: string }[];
    if (!Array.isArray(current))
      throw new Error(
        "Dados locais inválidos. Exporte um backup antes de continuar.",
      );
    const examples = data[collection as keyof typeof data];
    const existing = new Set(current.map((entry) => entry.id ?? entry.code));
    const merged = [
      ...current,
      ...examples.filter(
        (entry) => !existing.has("id" in entry ? entry.id : entry.code),
      ),
    ];
    if (collection === "audit")
      merged.sort((a, b) =>
        (b as { createdAt: string }).createdAt.localeCompare(
          (a as { createdAt: string }).createdAt,
        ),
      );
    return [key, JSON.stringify(merged)] as const;
  });
  const previous = pending.map(
    ([key]) => [key, localStorage.getItem(key)] as const,
  );
  try {
    pending.forEach(([key, value]) => localStorage.setItem(key, value));
  } catch (error) {
    previous.forEach(([key, value]) =>
      value === null
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, value),
    );
    throw error;
  }
}

export function removeDemoData() {
  Object.values(stores).forEach((key) => {
    const current = JSON.parse(localStorage.getItem(key) || "[]") as {
      id?: string;
      code?: string;
    }[];
    localStorage.setItem(
      key,
      JSON.stringify(
        current.filter(
          (entry) => !(entry.id ?? entry.code ?? "").startsWith(PREFIX),
        ),
      ),
    );
  });
}
