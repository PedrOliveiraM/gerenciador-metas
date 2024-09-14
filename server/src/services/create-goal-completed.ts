import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalsCompletions, goals } from '../db/schema'

interface CreateGoalCompletionRequestDTO {
  goalId: string
}

export async function createGoalCompleted({
  goalId,
}: CreateGoalCompletionRequestDTO) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCompletionCountsUpToWeek = db
    .$with('goals_completion_counts_up_to_week')
    .as(
      db
        .select({
          goalId: goalsCompletions.goalId,
          completionCount: count(goalsCompletions.id).as('completionCount'),
        })
        .from(goalsCompletions)
        .where(
          and(
            lte(goalsCompletions.createAt, lastDayOfWeek),
            gte(goalsCompletions.createAt, firstDayOfWeek),
            eq(goalsCompletions.goalId, goalId)
          )
        )
        .groupBy(goalsCompletions.goalId)
    )

  const result = await db
    .with(goalsCompletionCountsUpToWeek)
    .select({
      id: goals.id,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount:
        sql /*sql */`COALESCE(${goalsCompletionCountsUpToWeek.completionCount},0)`.mapWith(
          Number
        ),
    })
    .from(goals)
    .leftJoin(
      goalsCompletionCountsUpToWeek,
      eq(goals.id, goalsCompletionCountsUpToWeek.goalId)
    )
    .where(eq(goals.id, goalId))
    .limit(1)

  const { desiredWeeklyFrequency, completionCount } = result[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('This goal has already been completed this week')
  }

  const insertResult = await db
    .insert(goalsCompletions)
    .values({
      goalId: goalId,
    })
    .returning()

  return {
    insertResult,
  }
}
