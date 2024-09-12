import { db } from '../db'
import { goals } from '../db/schema'

interface CreateGoalRequestDTO {
  title: string
  desiredWeeklyFrequency: number
}

export async function createGoal({
  title,
  desiredWeeklyFrequency,
}: CreateGoalRequestDTO) {
  const result = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning()

  const goal = result[0]

  return {
    goal,
  }
}
