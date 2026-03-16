"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Stage, Layer, Rect, Line, Text, Group, Circle, Transformer } from "react-konva"
import type Konva from "konva"
import type { MapElement, MapElementType, LabMap } from "@/lib/types"
import { mockItems } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Square,
  RectangleHorizontal,
  DoorOpen,
  Maximize2,
  Monitor,
  Zap,
  Armchair,
  Type,
  MousePointer2,
  Trash2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download,
  Upload,
  Grid3X3,
  Eye,
  Undo2,
  Save,
  Move,
  Package,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const GRID_SIZE = 20
const ELEMENT_COLORS: Record<MapElementType, string> = {
  wall: "#374151",
  table: "#e5e7eb",
  cabinet: "#9ca3af",
  door: "#f59e0b",
  window: "#38bdf8",
  equipment: "#3b82f6",
  "electrical-panel": "#ef4444",
  chair: "#2563eb",
  label: "transparent",
}

const ELEMENT_LABELS: Record<MapElementType, string> = {
  wall: "Parede",
  table: "Mesa/Bancada",
  cabinet: "Armário",
  door: "Porta",
  window: "Janela",
  equipment: "Equipamento",
  "electrical-panel": "Painel Elétrico",
  chair: "Banqueta",
  label: "Rótulo",
}

const ELEMENT_DEFAULTS: Record<MapElementType, { width: number; height: number }> = {
  wall: { width: 200, height: 10 },
  table: { width: 200, height: 120 },
  cabinet: { width: 40, height: 80 },
  door: { width: 60, height: 10 },
  window: { width: 100, height: 10 },
  equipment: { width: 30, height: 30 },
  "electrical-panel": { width: 30, height: 100 },
  chair: { width: 20, height: 20 },
  label: { width: 120, height: 30 },
}

const TOOL_ICONS: Record<MapElementType, React.ComponentType<{ className?: string }>> = {
  wall: RectangleHorizontal,
  table: Square,
  cabinet: RectangleHorizontal,
  door: DoorOpen,
  window: Maximize2,
  equipment: Monitor,
  "electrical-panel": Zap,
  chair: Armchair,
  label: Type,
}

interface LabMapEditorProps {
  initialMap?: LabMap
  onSave?: (map: LabMap) => void
  readOnly?: boolean
}

function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

function generateId() {
  return `el-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
}

// Renders individual map elements
function MapElementShape({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  readOnly,
}: {
  element: MapElement
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  readOnly: boolean
}) {
  const shapeRef = useRef<Konva.Group>(null)
  const color = element.color || ELEMENT_COLORS[element.type]

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    onDragEnd(snapToGrid(node.x()), snapToGrid(node.y()))
  }

  // Equipment markers get a special look
  if (element.type === "equipment") {
    return (
      <Group
        ref={shapeRef}
        x={element.x}
        y={element.y}
        draggable={!readOnly}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
      >
        {/* Pulsing background circle */}
        <Circle
          x={element.width / 2}
          y={element.height / 2}
          radius={element.width / 2 + 4}
          fill={isSelected ? "#3b82f6" : "#dbeafe"}
          stroke={isSelected ? "#1d4ed8" : "#3b82f6"}
          strokeWidth={isSelected ? 2 : 1}
          opacity={0.6}
        />
        {/* Inner circle */}
        <Circle
          x={element.width / 2}
          y={element.height / 2}
          radius={element.width / 2 - 2}
          fill="#3b82f6"
          stroke="#1d4ed8"
          strokeWidth={1}
        />
        {/* Icon dot */}
        <Circle
          x={element.width / 2}
          y={element.height / 2}
          radius={4}
          fill="white"
        />
        {/* Label */}
        {element.label && (
          <Text
            x={-30}
            y={element.height + 6}
            width={element.width + 60}
            text={element.label}
            fontSize={10}
            fontStyle="bold"
            fill="#1e3a5f"
            align="center"
          />
        )}
      </Group>
    )
  }

  if (element.type === "chair") {
    return (
      <Group
        ref={shapeRef}
        x={element.x}
        y={element.y}
        draggable={!readOnly}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
      >
        <Circle
          x={element.width / 2}
          y={element.height / 2}
          radius={element.width / 2}
          fill={isSelected ? "#93c5fd" : "#60a5fa"}
          stroke={isSelected ? "#1d4ed8" : "#2563eb"}
          strokeWidth={isSelected ? 2 : 1}
        />
      </Group>
    )
  }

  if (element.type === "door") {
    return (
      <Group
        ref={shapeRef}
        x={element.x}
        y={element.y}
        draggable={!readOnly}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        rotation={element.rotation}
      >
        <Rect
          width={element.width}
          height={Math.max(element.height, 6)}
          fill={isSelected ? "#fbbf24" : "#f59e0b"}
          stroke={isSelected ? "#d97706" : "#b45309"}
          strokeWidth={isSelected ? 2 : 1}
          cornerRadius={2}
        />
        {/* Door swing arc indicator */}
        <Line
          points={[0, 0, element.width * 0.4, -element.width * 0.3]}
          stroke="#b45309"
          strokeWidth={1}
          dash={[4, 2]}
        />
        {element.label && (
          <Text
            x={0}
            y={-14}
            width={element.width}
            text={element.label}
            fontSize={9}
            fill="#92400e"
            align="center"
          />
        )}
      </Group>
    )
  }

  if (element.type === "window") {
    return (
      <Group
        ref={shapeRef}
        x={element.x}
        y={element.y}
        draggable={!readOnly}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        rotation={element.rotation}
      >
        <Rect
          width={element.width}
          height={Math.max(element.height, 8)}
          fill={isSelected ? "#7dd3fc" : "#38bdf8"}
          stroke={isSelected ? "#0284c7" : "#0ea5e9"}
          strokeWidth={isSelected ? 2 : 1}
        />
        {/* Window pane lines */}
        <Line
          points={[element.width / 3, 0, element.width / 3, Math.max(element.height, 8)]}
          stroke="#0ea5e9"
          strokeWidth={1}
        />
        <Line
          points={[(element.width / 3) * 2, 0, (element.width / 3) * 2, Math.max(element.height, 8)]}
          stroke="#0ea5e9"
          strokeWidth={1}
        />
      </Group>
    )
  }

  if (element.type === "label") {
    return (
      <Group
        ref={shapeRef}
        x={element.x}
        y={element.y}
        draggable={!readOnly}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
      >
        {isSelected && (
          <Rect
            width={element.width}
            height={element.height}
            fill="transparent"
            stroke="#94a3b8"
            strokeWidth={1}
            dash={[4, 4]}
          />
        )}
        <Text
          width={element.width}
          height={element.height}
          text={element.label || "Rótulo"}
          fontSize={13}
          fontStyle="bold"
          fill="#475569"
          align="center"
          verticalAlign="middle"
        />
      </Group>
    )
  }

  // Default rectangle-based elements (wall, table, cabinet, electrical-panel)
  return (
    <Group
      ref={shapeRef}
      x={element.x}
      y={element.y}
      draggable={!readOnly}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      rotation={element.rotation}
    >
      <Rect
        width={element.width}
        height={element.height}
        fill={color}
        stroke={isSelected ? "#2563eb" : (element.type === "wall" ? "#1f2937" : "#6b7280")}
        strokeWidth={isSelected ? 2.5 : 1}
        cornerRadius={element.type === "table" ? 4 : element.type === "cabinet" ? 2 : 0}
        shadowColor={isSelected ? "#3b82f6" : undefined}
        shadowBlur={isSelected ? 8 : 0}
        shadowOpacity={0.4}
      />
      {element.label && element.type !== "wall" && (
        <Text
          x={2}
          y={element.height < 30 ? element.height + 4 : element.height / 2 - 6}
          width={element.width - 4}
          text={element.label}
          fontSize={element.type === "cabinet" ? 8 : 10}
          fill={element.type === "table" ? "#374151" : "#f9fafb"}
          align="center"
          wrap="none"
          ellipsis
        />
      )}
    </Group>
  )
}

export function LabMapEditor({ initialMap, onSave, readOnly = false }: LabMapEditorProps) {
  const [elements, setElements] = useState<MapElement[]>(initialMap?.elements || [])
  const [selectedTool, setSelectedTool] = useState<"select" | MapElementType>("select")
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [scale, setScale] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [mapSize, setMapSize] = useState({
    width: initialMap?.width || 1000,
    height: initialMap?.height || 700,
  })
  const [history, setHistory] = useState<MapElement[][]>([initialMap?.elements || []])
  const [historyIndex, setHistoryIndex] = useState(0)

  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const pushHistory = useCallback((newElements: MapElement[]) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newElements])
    setHistoryIndex((prev) => prev + 1)
  }, [historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setElements(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const selectedElement = elements.find((el) => el.id === selectedElementId)

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Click on empty area
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty && selectedTool === "select") {
      setSelectedElementId(null)
      return
    }

    if (clickedOnEmpty && selectedTool !== "select") {
      const stage = stageRef.current
      if (!stage) return
      const pointer = stage.getPointerPosition()
      if (!pointer) return

      const x = snapToGrid((pointer.x - stagePos.x) / scale)
      const y = snapToGrid((pointer.y - stagePos.y) / scale)
      const defaults = ELEMENT_DEFAULTS[selectedTool]

      const newElement: MapElement = {
        id: generateId(),
        type: selectedTool,
        x,
        y,
        width: defaults.width,
        height: defaults.height,
        rotation: 0,
        label: ELEMENT_LABELS[selectedTool],
      }

      const newElements = [...elements, newElement]
      setElements(newElements)
      pushHistory(newElements)
      setSelectedElementId(newElement.id)
    }
  }

  const handleElementDragEnd = (id: string, x: number, y: number) => {
    const newElements = elements.map((el) => (el.id === id ? { ...el, x, y } : el))
    setElements(newElements)
    pushHistory(newElements)
  }

  const updateSelectedElement = (updates: Partial<MapElement>) => {
    if (!selectedElementId) return
    const newElements = elements.map((el) =>
      el.id === selectedElementId ? { ...el, ...updates } : el
    )
    setElements(newElements)
    pushHistory(newElements)
  }

  const deleteSelected = () => {
    if (!selectedElementId) return
    const newElements = elements.filter((el) => el.id !== selectedElementId)
    setElements(newElements)
    pushHistory(newElements)
    setSelectedElementId(null)
  }

  const rotateSelected = () => {
    if (!selectedElement) return
    updateSelectedElement({ rotation: (selectedElement.rotation + 90) % 360 })
  }

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const scaleBy = 1.08
    const newScale = e.evt.deltaY > 0 ? scale / scaleBy : scale * scaleBy
    setScale(Math.max(0.3, Math.min(3, newScale)))
  }

  const zoomIn = () => setScale((s) => Math.min(3, s * 1.2))
  const zoomOut = () => setScale((s) => Math.max(0.3, s / 1.2))
  const resetZoom = () => {
    setScale(1)
    setStagePos({ x: 0, y: 0 })
  }

  const handleSave = () => {
    const map: LabMap = {
      id: initialMap?.id || `map-${Date.now()}`,
      laboratory: initialMap?.laboratory || "Laboratório de Robótica",
      name: initialMap?.name || "Nova Planta",
      width: mapSize.width,
      height: mapSize.height,
      elements,
      createdAt: initialMap?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSave?.(map)
  }

  const exportImage = () => {
    const stage = stageRef.current
    if (!stage) return
    const uri = stage.toDataURL({ pixelRatio: 2 })
    const link = document.createElement("a")
    link.download = "planta-laboratorio.png"
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Grid lines
  const gridLines = []
  if (showGrid) {
    for (let i = 0; i <= mapSize.width; i += GRID_SIZE) {
      gridLines.push(
        <Line
          key={`gv-${i}`}
          points={[i, 0, i, mapSize.height]}
          stroke="#e2e8f0"
          strokeWidth={i % 100 === 0 ? 0.8 : 0.3}
        />
      )
    }
    for (let j = 0; j <= mapSize.height; j += GRID_SIZE) {
      gridLines.push(
        <Line
          key={`gh-${j}`}
          points={[0, j, mapSize.width, j]}
          stroke="#e2e8f0"
          strokeWidth={j % 100 === 0 ? 0.8 : 0.3}
        />
      )
    }
  }

  const tools: { type: "select" | MapElementType; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { type: "select", icon: MousePointer2, label: "Selecionar" },
    { type: "wall", icon: RectangleHorizontal, label: "Parede" },
    { type: "table", icon: Square, label: "Mesa/Bancada" },
    { type: "cabinet", icon: RectangleHorizontal, label: "Armário" },
    { type: "door", icon: DoorOpen, label: "Porta" },
    { type: "window", icon: Maximize2, label: "Janela" },
    { type: "equipment", icon: Monitor, label: "Equipamento" },
    { type: "electrical-panel", icon: Zap, label: "Painel Elétrico" },
    { type: "chair", icon: Armchair, label: "Banqueta" },
    { type: "label", icon: Type, label: "Rótulo" },
  ]

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        {!readOnly && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2">
            <div className="flex items-center gap-1 rounded-md bg-muted p-1">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Tooltip key={tool.type}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedTool === tool.type ? "default" : "ghost"}
                        size="icon"
                        className="size-8"
                        onClick={() => setSelectedTool(tool.type)}
                      >
                        <Icon className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{tool.label}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8" onClick={undo} disabled={historyIndex === 0}>
                    <Undo2 className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Desfazer</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8" onClick={deleteSelected} disabled={!selectedElementId}>
                    <Trash2 className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Excluir</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8" onClick={rotateSelected} disabled={!selectedElementId}>
                    <RotateCw className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Rotacionar 90°</p></TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8" onClick={zoomOut}>
                    <ZoomOut className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Zoom -</p></TooltipContent>
              </Tooltip>
              <span className="w-12 select-none text-center text-xs text-muted-foreground">
                {Math.round(scale * 100)}%
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8" onClick={zoomIn}>
                    <ZoomIn className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Zoom +</p></TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={showGrid ? "secondary" : "ghost"} size="icon" className="size-8" onClick={() => setShowGrid(!showGrid)}>
                  <Grid3X3 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Grade</p></TooltipContent>
            </Tooltip>

            <div className="ml-auto flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={exportImage}>
                    <Download className="mr-1.5 size-3" />
                    Exportar PNG
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Exportar como imagem</p></TooltipContent>
              </Tooltip>
              <Button size="sm" onClick={handleSave}>
                <Save className="mr-1.5 size-3" />
                Salvar Planta
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Canvas */}
          <div
            ref={containerRef}
            className="flex-1 overflow-hidden rounded-lg border bg-white"
            style={{ height: readOnly ? 450 : 520 }}
          >
            <Stage
              ref={stageRef}
              width={containerSize.width}
              height={readOnly ? 450 : 520}
              scaleX={scale}
              scaleY={scale}
              x={stagePos.x}
              y={stagePos.y}
              draggable={selectedTool === "select"}
              onClick={handleStageClick}
              onWheel={handleWheel}
              onDragEnd={(e) => {
                if (e.target === stageRef.current) {
                  setStagePos({ x: e.target.x(), y: e.target.y() })
                }
              }}
            >
              <Layer>
                {/* Background */}
                <Rect
                  x={0}
                  y={0}
                  width={mapSize.width}
                  height={mapSize.height}
                  fill="#f8fafc"
                  stroke="#cbd5e1"
                  strokeWidth={2}
                />

                {/* Grid */}
                {gridLines}

                {/* Blueprint overlay label */}
                <Text
                  x={mapSize.width / 2 - 80}
                  y={mapSize.height - 25}
                  text={`${mapSize.width / 10}m × ${mapSize.height / 10}m`}
                  fontSize={11}
                  fill="#94a3b8"
                  fontStyle="italic"
                />

                {/* Elements */}
                {elements.map((element) => (
                  <MapElementShape
                    key={element.id}
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onSelect={() => {
                      setSelectedElementId(element.id)
                      if (selectedTool !== "select") setSelectedTool("select")
                    }}
                    onDragEnd={(x, y) => handleElementDragEnd(element.id, x, y)}
                    readOnly={readOnly}
                  />
                ))}
              </Layer>
            </Stage>
          </div>

          {/* Properties Panel */}
          {!readOnly && (
            <Card className="w-full shrink-0 lg:w-64">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Propriedades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedElement ? (
                  <>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="mb-2">
                        {ELEMENT_LABELS[selectedElement.type]}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Rótulo</Label>
                      <Input
                        value={selectedElement.label || ""}
                        onChange={(e) => updateSelectedElement({ label: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">X</Label>
                        <Input
                          type="number"
                          value={selectedElement.x}
                          onChange={(e) => updateSelectedElement({ x: Number(e.target.value) })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Y</Label>
                        <Input
                          type="number"
                          value={selectedElement.y}
                          onChange={(e) => updateSelectedElement({ y: Number(e.target.value) })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Largura</Label>
                        <Input
                          type="number"
                          value={selectedElement.width}
                          onChange={(e) => updateSelectedElement({ width: Number(e.target.value) })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Altura</Label>
                        <Input
                          type="number"
                          value={selectedElement.height}
                          onChange={(e) => updateSelectedElement({ height: Number(e.target.value) })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Rotação</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={selectedElement.rotation}
                          onChange={(e) => updateSelectedElement({ rotation: Number(e.target.value) })}
                          className="h-8 text-sm"
                        />
                        <span className="text-xs text-muted-foreground">°</span>
                      </div>
                    </div>

                    {selectedElement.type === "equipment" && (
                      <div className="space-y-2">
                        <Label className="text-xs">Vincular ao Item</Label>
                        <Select
                          value={selectedElement.linkedItemId || "none"}
                          onValueChange={(value) =>
                            updateSelectedElement({ linkedItemId: value === "none" ? undefined : value })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Nenhum" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhum</SelectItem>
                            {mockItems.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                <span className="text-xs">{item.internalCode} - {item.name}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedElement.linkedItemId && (
                          <div className="rounded-md bg-muted p-2">
                            <p className="text-xs font-medium">
                              {mockItems.find((i) => i.id === selectedElement.linkedItemId)?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {mockItems.find((i) => i.id === selectedElement.linkedItemId)?.location}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <Separator />

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={deleteSelected}
                    >
                      <Trash2 className="mr-2 size-3" />
                      Excluir Elemento
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Selecione um elemento para editar ou escolha uma ferramenta para adicionar.
                    </p>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-xs">Legenda</Label>
                      <div className="space-y-1.5">
                        {[
                          { color: "#374151", label: "Parede" },
                          { color: "#e5e7eb", label: "Mesa/Bancada", border: true },
                          { color: "#9ca3af", label: "Armário" },
                          { color: "#f59e0b", label: "Porta" },
                          { color: "#38bdf8", label: "Janela" },
                          { color: "#3b82f6", label: "Equipamento", rounded: true },
                          { color: "#ef4444", label: "Painel Elétrico" },
                          { color: "#60a5fa", label: "Banqueta", rounded: true },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-2">
                            <div
                              className={`size-3 ${item.rounded ? "rounded-full" : "rounded-sm"}`}
                              style={{
                                backgroundColor: item.color,
                                border: item.border ? "1px solid #9ca3af" : undefined,
                              }}
                            />
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-xs">Elementos</Label>
                      <p className="text-xs text-muted-foreground">
                        {elements.length} elemento(s) no mapa
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {elements.filter((e) => e.type === "equipment").length} equipamento(s)
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Read-only legend */}
        {readOnly && (
          <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-3">
            <span className="text-xs font-medium text-muted-foreground">Legenda:</span>
            {[
              { color: "#374151", label: "Parede" },
              { color: "#e5e7eb", label: "Mesa/Bancada", border: true },
              { color: "#9ca3af", label: "Armário" },
              { color: "#f59e0b", label: "Porta" },
              { color: "#38bdf8", label: "Janela" },
              { color: "#3b82f6", label: "Equipamento", rounded: true },
              { color: "#ef4444", label: "Painel Elétrico" },
              { color: "#60a5fa", label: "Banqueta", rounded: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className={`size-3 ${item.rounded ? "rounded-full" : "rounded-sm"}`}
                  style={{
                    backgroundColor: item.color,
                    border: item.border ? "1px solid #9ca3af" : undefined,
                  }}
                />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
