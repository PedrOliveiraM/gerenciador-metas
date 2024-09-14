import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { createCompletedGoalRoute } from '../routes/create-completed-goal'
import { createGoalRoute } from '../routes/create-goal'
import { getPendingGoalsRoute } from '../routes/get-pending-goals'
import { getWeekSummaryRoute } from '../routes/get-week-summary'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createCompletedGoalRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)
app.register(createGoalRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server Rodando na porta 3333')
  })
