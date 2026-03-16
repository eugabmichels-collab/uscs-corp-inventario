"use client"

import { Badge } from "@/components/ui/badge"
import { mockItems } from "@/lib/mock-data"
import type { LabMap, MapElement } from "@/lib/types"
import type Konva from "konva"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva"

interface LabMapViewerProps {
    map: LabMap
    highlightItemId?: string
}

const GRID_SIZE = 20

const ELEMENT_COLORS: Record<string, string> = {
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

function ViewerElementShape({
    element,
    isHighlighted,
    onHover,
    onLeave,
    onClick,
}: {
    element: MapElement
    isHighlighted: boolean
    onHover: (el: MapElement, pos: { x: number; y: number }) => void
    onLeave: () => void
    onClick: () => void
}) {
    const color = element.color || ELEMENT_COLORS[element.type]

    const handleMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage()
        if (!stage) return
        const pointer = stage.getPointerPosition()
        if (pointer) {
            onHover(element, { x: pointer.x, y: pointer.y })
        }
        if (element.type === "equipment") {
            const container = stage.container()
            container.style.cursor = "pointer"
        }
    }

    const handleMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
        onLeave()
        const stage = e.target.getStage()
        if (stage) {
            stage.container().style.cursor = "default"
        }
    }

    if (element.type === "equipment") {
        return (
            <Group
                x={element.x}
                y={element.y}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={onClick}
                onTap={onClick}
            >
                <Circle
                    x={element.width / 2}
                    y={element.height / 2}
                    radius={element.width / 2 + (isHighlighted ? 8 : 4)}
                    fill={isHighlighted ? "#1d4ed8" : "#dbeafe"}
                    stroke={isHighlighted ? "#1e40af" : "#3b82f6"}
                    strokeWidth={isHighlighted ? 3 : 1}
                    opacity={isHighlighted ? 0.8 : 0.6}
                />
                <Circle
                    x={element.width / 2}
                    y={element.height / 2}
                    radius={element.width / 2 - 2}
                    fill={isHighlighted ? "#1d4ed8" : "#3b82f6"}
                    stroke="#1d4ed8"
                    strokeWidth={1}
                />
                <Circle
                    x={element.width / 2}
                    y={element.height / 2}
                    radius={4}
                    fill="white"
                />
                {element.label && (
                    <Text
                        x={-30}
                        y={element.height + 6}
                        width={element.width + 60}
                        text={element.label}
                        fontSize={10}
                        fontStyle="bold"
                        fill={isHighlighted ? "#1e40af" : "#1e3a5f"}
                        align="center"
                    />
                )}
            </Group>
        )
    }

    if (element.type === "chair") {
        return (
            <Group x={element.x} y={element.y}>
                <Circle
                    x={element.width / 2}
                    y={element.height / 2}
                    radius={element.width / 2}
                    fill="#60a5fa"
                    stroke="#2563eb"
                    strokeWidth={1}
                />
            </Group>
        )
    }

    if (element.type === "door") {
        return (
            <Group x={element.x} y={element.y} rotation={element.rotation}>
                <Rect
                    width={element.width}
                    height={Math.max(element.height, 6)}
                    fill="#f59e0b"
                    stroke="#b45309"
                    strokeWidth={1}
                    cornerRadius={2}
                />
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
            <Group x={element.x} y={element.y} rotation={element.rotation}>
                <Rect
                    width={element.width}
                    height={Math.max(element.height, 8)}
                    fill="#38bdf8"
                    stroke="#0ea5e9"
                    strokeWidth={1}
                />
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
            <Group x={element.x} y={element.y}>
                <Text
                    width={element.width}
                    height={element.height}
                    text={element.label || ""}
                    fontSize={13}
                    fontStyle="bold"
                    fill="#475569"
                    align="center"
                    verticalAlign="middle"
                />
            </Group>
        )
    }

    return (
        <Group x={element.x} y={element.y} rotation={element.rotation}>
            <Rect
                width={element.width}
                height={element.height}
                fill={color}
                stroke={element.type === "wall" ? "#1f2937" : "#6b7280"}
                strokeWidth={1}
                cornerRadius={element.type === "table" ? 4 : element.type === "cabinet" ? 2 : 0}
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

export function LabMapViewer({ map, highlightItemId }: LabMapViewerProps) {
    const router = useRouter()
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(800)
    const [tooltip, setTooltip] = useState<{ element: MapElement; x: number; y: number } | null>(null)
    const [scale, setScale] = useState(1)
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
    const stageRef = useRef<Konva.Stage>(null)

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                const w = containerRef.current.offsetWidth
                setContainerWidth(w)
                // Auto-fit the map into the container
                const fitScale = Math.min(w / map.width, 450 / map.height, 1)
                setScale(fitScale)
                setStagePos({
                    x: (w - map.width * fitScale) / 2,
                    y: (450 - map.height * fitScale) / 2,
                })
            }
        }
        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => window.removeEventListener("resize", updateWidth)
    }, [map.width, map.height])

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault()
        const scaleBy = 1.08
        const newScale = e.evt.deltaY > 0 ? scale / scaleBy : scale * scaleBy
        setScale(Math.max(0.3, Math.min(3, newScale)))
    }

    const linkedItem = tooltip?.element.linkedItemId
        ? mockItems.find((i) => i.id === tooltip.element.linkedItemId)
        : null

    const gridLines = []
    for (let i = 0; i <= map.width; i += GRID_SIZE) {
        gridLines.push(
            <Line
                key={`gv-${i}`}
                points={[i, 0, i, map.height]}
                stroke="#e2e8f0"
                strokeWidth={i % 100 === 0 ? 0.6 : 0.2}
            />
        )
    }
    for (let j = 0; j <= map.height; j += GRID_SIZE) {
        gridLines.push(
            <Line
                key={`gh-${j}`}
                points={[0, j, map.width, j]}
                stroke="#e2e8f0"
                strokeWidth={j % 100 === 0 ? 0.6 : 0.2}
            />
        )
    }

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="overflow-hidden rounded-lg border bg-white"
                style={{ height: 450 }}
            >
                <Stage
                    ref={stageRef}
                    width={containerWidth}
                    height={450}
                    scaleX={scale}
                    scaleY={scale}
                    x={stagePos.x}
                    y={stagePos.y}
                    draggable
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
                            width={map.width}
                            height={map.height}
                            fill="#f8fafc"
                            stroke="#cbd5e1"
                            strokeWidth={2}
                        />
                        {/* Grid */}
                        {gridLines}

                        {/* Elements */}
                        {map.elements.map((element) => (
                            <ViewerElementShape
                                key={element.id}
                                element={element}
                                isHighlighted={highlightItemId ? element.linkedItemId === highlightItemId : false}
                                onHover={(el, pos) => setTooltip({ element: el, x: pos.x, y: pos.y })}
                                onLeave={() => setTooltip(null)}
                                onClick={() => {
                                    if (element.linkedItemId) {
                                        router.push(`/inventario/${element.linkedItemId}`)
                                    }
                                }}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>

            {/* HTML Tooltip overlay */}
            {tooltip && tooltip.element.type === "equipment" && (
                <div
                    className="pointer-events-none absolute z-50 max-w-xs rounded-lg border bg-popover p-3 shadow-lg"
                    style={{
                        left: tooltip.x + 12,
                        top: tooltip.y - 10,
                    }}
                >
                    <p className="text-sm font-medium">{tooltip.element.label}</p>
                    {linkedItem && (
                        <div className="mt-1 space-y-1">
                            <p className="text-xs text-muted-foreground">{linkedItem.name}</p>
                            <div className="flex items-center gap-1.5">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    {linkedItem.internalCode}
                                </Badge>
                                <Badge
                                    variant={
                                        linkedItem.usageStatus === "Disponível"
                                            ? "default"
                                            : linkedItem.usageStatus === "Em uso"
                                                ? "secondary"
                                                : "destructive"
                                    }
                                    className="text-[10px] px-1.5 py-0"
                                >
                                    {linkedItem.usageStatus}
                                </Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                Clique para ver detalhes
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Legend bar */}
            <div className="mt-3 flex flex-wrap items-center gap-4 rounded-lg border bg-card p-3">
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
        </div>
    )
}
