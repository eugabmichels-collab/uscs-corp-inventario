import { mockTaskRequests } from "@/lib/mock-data"
import TaskDetailClient from "./task-detail-client"

export function generateStaticParams() {
  return mockTaskRequests.map((task) => ({ id: task.id }))
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TaskDetailClient id={id} />
}
