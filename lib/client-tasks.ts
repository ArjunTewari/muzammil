import { USERS } from './users'
import { getOperatorData, type TaskItem } from './operator-data'

export interface ClientTask {
  operatorId: string
  operatorName: string
  operatorInitials: string
  operatorTitle: string
  accentColor: string
  task: TaskItem
}

// Aggregate every operator's tasks that belong to a given client (by shortName).
export function getClientWorkload(clientShortName: string): ClientTask[] {
  const result: ClientTask[] = []
  for (const u of USERS) {
    if (u.role === 'master') continue
    const data = getOperatorData(u.id)
    if (!data) continue
    for (const task of data.tasks) {
      if (task.client === clientShortName) {
        result.push({
          operatorId: u.id,
          operatorName: u.name,
          operatorInitials: u.initials,
          operatorTitle: u.title,
          accentColor: u.accentColor,
          task,
        })
      }
    }
  }
  return result
}

// Distinct operators touching a client, in pipeline order.
export function getClientAgents(clientShortName: string) {
  const order = ['priya', 'rohan', 'divya', 'arjit', 'sneha', 'karan']
  const workload = getClientWorkload(clientShortName)
  const ids = Array.from(new Set(workload.map((w) => w.operatorId)))
  return ids
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map((id) => USERS.find((u) => u.id === id)!)
}

export function getClientBlockedCount(clientShortName: string): number {
  return getClientWorkload(clientShortName).filter((w) => w.task.status === 'blocked').length
}
