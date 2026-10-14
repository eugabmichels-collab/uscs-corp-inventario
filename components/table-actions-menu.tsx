"use client";

import type { ComponentProps } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function TableActionsMenu(
  props: Omit<ComponentProps<typeof DropdownMenu>, "modal">,
) {
  return <DropdownMenu {...props} modal={false} />;
}

export function TableActionsMenuTrigger({ label }: { label: string }) {
  return (
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-md text-muted-foreground hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        aria-label={`Ações de ${label}`}
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
  );
}

export function TableActionsMenuContent({
  children,
  className,
  ...props
}: ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      align="end"
      sideOffset={6}
      className={cn(
        "min-w-60 max-w-[calc(100vw-2rem)] rounded-lg p-1 shadow-lg [&_[data-slot=dropdown-menu-item]]:min-h-10 [&_[data-slot=dropdown-menu-item]]:cursor-pointer [&_[data-slot=dropdown-menu-item]]:gap-3 [&_[data-slot=dropdown-menu-item]]:rounded-md [&_[data-slot=dropdown-menu-item]]:px-3 [&_[data-slot=dropdown-menu-item]]:py-2 [&_[data-slot=dropdown-menu-item]_svg]:size-4 [&_[data-slot=dropdown-menu-item]_svg]:mr-0 [&_[data-slot=dropdown-menu-item]_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <DropdownMenuLabel className="px-3 py-2.5 font-semibold">
        Ações
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {children}
    </DropdownMenuContent>
  );
}
