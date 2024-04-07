import { FastifyInstance } from 'fastify/types/instance'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequest } from '../_errors/bad-request'
import { prisma } from '../lib/prisma'
import { generateSlug } from '../utils/generate-slug'

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events',
    {
      schema: {
        summary: 'Create an event',
        tags: ['events'],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          eventStart: z.coerce.date(),
          eventFinish: z.coerce.date(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, replay) => {
      const { title, details, eventStart, eventFinish, maximumAttendees } =
        request.body

      const slug = generateSlug(title)

      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug,
        },
      })

      if (eventWithSameSlug) {
        throw new BadRequest('Another event with same title already exists')
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          eventStart,
          eventFinish,
          maximumAttendees,
          slug,
        },
      })

      return replay.status(201).send({ eventId: event.id })
    },
  )
}
