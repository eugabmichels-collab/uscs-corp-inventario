"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Bot,
  ChevronDown,
  ClipboardList,
  Download,
  FileBarChart,
  FlaskConical,
  History,
  LayoutDashboard,
  LogOut,
  MessageSquarePlus,
  Package,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const mvpNavigation = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inventário", url: "/inventario", icon: Package },
  { title: "Catálogo de Kits", url: "/catalogo", icon: BookOpen },
];

// Módulos planejados: preservados no menu e temporariamente ocultos durante o MVP.
const futureMainNavigation = [
  { title: "Empréstimos", url: "/emprestimos", icon: ClipboardList },
  { title: "Manutenção", url: "/manutencao", icon: Wrench },
  { title: "Solicitações", url: "/solicitacoes", icon: MessageSquarePlus },
];

const futureLabNavigation = [
  { title: "Lab. Física", url: "/laboratorios/fisica", icon: FlaskConical },
  { title: "Lab. Robótica", url: "/laboratorios/robotica", icon: Bot },
];

const futureAdminNavigation = [
  { title: "Histórico e Auditoria", url: "/auditoria", icon: History },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart },
];

export function AppSidebar() {
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("uscs-session") || "null");
    setIsAdmin(session?.role === "Administrador");
  }, []);

  const visibleNavigation = isAdmin
    ? [
      ...mvpNavigation,
      { title: "Equipe", url: "/equipe", icon: Users },
      { title: "Backup e dados", url: "/backup", icon: Download },
      { title: "Auditoria", url: "/auditoria", icon: History },
    ]
    : mvpNavigation;

  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  const futureGroups = [
    ["Operações", futureMainNavigation],
    ["Laboratórios", futureLabNavigation],
    ["Administração", futureAdminNavigation],
  ] as const;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-[10px] font-bold text-sidebar-primary-foreground">
            USCS
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Inventário de Campo
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              MVP · Laboratórios
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Inventário</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    onClick={closeMobileSidebar}
                    isActive={
                      pathname === item.url ||
                      pathname.startsWith(item.url + "/")
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {futureGroups.map(([label, items]) => (
          <SidebarGroup key={label} className="hidden">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      onClick={closeMobileSidebar}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-sidebar-primary text-xs text-sidebar-primary-foreground">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium">Administrador</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      admin@uscs.edu.br
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" side="top" align="start">
                <DropdownMenuItem asChild>
                  <Link href="/perfil" onClick={closeMobileSidebar}>
                    <Settings className="mr-2 size-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="text-destructive"
                    onClick={closeMobileSidebar}
                  >
                    <LogOut className="mr-2 size-4" />
                    Sair
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
