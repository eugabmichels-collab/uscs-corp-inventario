"use client";

import Link from "next/link";
import { Eye, type LucideIcon } from "lucide-react";
import {
  TableActionsMenu,
  TableActionsMenuContent,
  TableActionsMenuTrigger,
} from "@/components/table-actions-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function RecordActions({
  label,
  onDetails,
  action,
}: {
  label: string;
  onDetails: () => void;
  action?: {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    href?: string;
  };
}) {
  const ActionIcon = action?.icon;
  return (
    <TableActionsMenu>
      <TableActionsMenuTrigger label={label} />
      <TableActionsMenuContent>
        <DropdownMenuItem onClick={onDetails}>
          <Eye className="size-4" aria-hidden="true" />
          Ver detalhes
        </DropdownMenuItem>
        {action &&
          (action.href ? (
            <DropdownMenuItem asChild>
              <Link href={action.href}>
                {ActionIcon && <ActionIcon aria-hidden="true" />}
                {action.label}
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={action.onClick}>
              {ActionIcon && <ActionIcon aria-hidden="true" />}
              {action.label}
            </DropdownMenuItem>
          ))}
      </TableActionsMenuContent>
    </TableActionsMenu>
  );
}

export function RecordDetails({
  title,
  description,
  open,
  onClose,
  fields,
}: {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
  fields: { label: string; value: React.ReactNode }[];
}) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="break-words">
            {description}
          </DialogDescription>
        </DialogHeader>
        <dl className="grid gap-4 py-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="min-w-0">
              <dt className="text-xs text-muted-foreground">{field.label}</dt>
              <dd className="mt-1 break-words text-sm">
                {field.value === "" || field.value == null
                  ? "Não informado"
                  : field.value}
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
