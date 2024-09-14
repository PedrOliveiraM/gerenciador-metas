import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import z from 'zod'
import { createGoal } from '../services/create-goal'
import { getWeekPendingGoals } from '../services/get-week-pending-goals'
import { createGoalCompleted } from '../services/create-goal-completed'
import { createGoalRoute } from '../routes/create-goal'
import { getPendingGoalsRoute } from '../routes/get-pending-goals'
import { createCompletedGoalRoute } from '../routes/create-completed-goal'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(getPendingGoalsRoute)
app.register(createCompletedGoalRoute)
app.register(createGoalRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server Rodando na porta 3333')
  })
