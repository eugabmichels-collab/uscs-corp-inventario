"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAuditLogsByItem } from "@/lib/mock-data"
import { getAuditActionIcon, getAuditActionBadge } from "@/components/badges"
import { formatDateTime } from "@/lib/format"

interface ItemHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemId: string
  itemCode: string
  itemName: string
}

export function ItemHistoryDialog({
  open,
  onOpenChange,
  itemId,
  itemCode,
  itemName,
}: ItemHistoryDialogProps) {
  const logs = getAuditLogsByItem(itemId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Histórico do Item</DialogTitle>
          <DialogDescription>
            <span className="font-mono">{itemCode}</span> — {itemName}
          </DialogDescription>
        </DialogHeader>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Nenhum registro encontrado para este item.
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={log.id}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {getAuditActionIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getAuditActionBadge(log.action)}
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{log.details}</p>
                      <p className="text-xs text-muted-foreground">
                        por {log.userName}
                      </p>
                    </div>
                  </div>
                  {index < logs.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
