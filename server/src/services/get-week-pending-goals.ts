import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalsCompletions, goals } from '../db/schema'

const firstDayOfWeek = dayjs().startOf('week').toDate()
const lastDayOfWeek = dayjs().endOf('week').toDate()

export async function getWeekPendingGoals() {
  const goalsCreatedUptoWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createAt: goals.createAt,
      })
      .from(goals)
      .where(lte(goals.createAt, lastDayOfWeek))
  )

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
            gte(goalsCompletions.createAt, firstDayOfWeek)
          )
        )
        .groupBy(goalsCompletions.goalId)
    )

  const pendingGoals = await db
    .with(goalsCreatedUptoWeek, goalsCompletionCountsUpToWeek)
    .select({
      goalId: goalsCreatedUptoWeek.id,
      title: goalsCreatedUptoWeek.title,
      desiredWeeklyFrequency: goalsCreatedUptoWeek.desiredWeeklyFrequency,
      completionCount:
        sql /*sql */`COALESCE(${goalsCompletionCountsUpToWeek.completionCount},0)`.mapWith(
          Number
        ),
    })
    .from(goalsCreatedUptoWeek)
    .leftJoin(
      goalsCompletionCountsUpToWeek,
      eq(goalsCreatedUptoWeek.id, goalsCompletionCountsUpToWeek.goalId)
    )

  return pendingGoals
}
