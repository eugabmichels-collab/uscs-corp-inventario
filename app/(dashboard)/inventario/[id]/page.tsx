import { mockItems } from "@/lib/mock-data"
import ItemDetailClient from "./item-detail-client"

export function generateStaticParams() {
  return mockItems.map((item) => ({ id: item.id }))
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ItemDetailClient id={id} />
}