import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../services/get-week-pending-goals'

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/goals-pending', async () => {
    const pendingGoals = await getWeekPendingGoals()
    return pendingGoals
  })
}
