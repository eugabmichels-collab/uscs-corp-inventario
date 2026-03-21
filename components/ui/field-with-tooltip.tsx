import React from "react"
import { Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FieldWithTooltipProps {
  label: string
  tooltip: string
  required?: boolean
  children: React.ReactNode
}

export function FieldWithTooltip({ label, tooltip, required, children }: FieldWithTooltipProps) {
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
