import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const goals = pgTable('goals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
  createAt: timestamp('create_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const goalCompletions = pgTable('goal_completion', {
  id: text('id').notNull(),
  goalId: text('goal_id')
    .references(() => goals.id)
    .notNull(),
  createAt: timestamp('create_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
