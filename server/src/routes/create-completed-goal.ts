import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createGoalCompleted } from '../services/create-goal-completed'

export const createCompletedGoalRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals-completed',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async request => {
      const { goalId } = request.body

      await createGoalCompleted({ goalId })
    }
  )
}
