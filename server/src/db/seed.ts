import dayjs from 'dayjs'
import { client, db } from '.'
import { goalCompletions, goals } from './schema'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      {
        title: 'Acordar cedo',
        desiredWeeklyFrequency: 5,
      },
      {
        title: 'Academia',
        desiredWeeklyFrequency: 5,
      },
      {
        title: 'Jogar bola',
        desiredWeeklyFrequency: 2,
      },
      {
        title: 'Ler um livro',
        desiredWeeklyFrequency: 4,
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week') // pegar primeiro dia dessa semana

  await db.insert(goalCompletions).values([
    {
      goalId: result[0].id,
      createAt: startOfWeek.toDate(),
    },
    {
      goalId: result[1].id,
      createAt: startOfWeek.add(1, 'day').toDate(),
    },
    {
      goalId: result[2].id,
      createAt: startOfWeek.add(2, 'day').toDate(),
    },
    {
      goalId: result[3].id,
      createAt: startOfWeek.add(3, 'day').toDate(),
    },
  ])
}

seed().finally(() => {
  client.end()
})
