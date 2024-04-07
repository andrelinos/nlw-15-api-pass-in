import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '../lib/prisma'

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId',
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),

        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              eventStart: z.date(),
              eventFinish: z.date(),
              maximumAttendees: z.number().int().nullable(),
              attendeesAmount: z.number().int(),
            }),
          }),
        },
      },
    },
    async (request, replay) => {
      const { eventId } = request.params

      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          eventStart: true,
          eventFinish: true,
          maximumAttendees: true,
          _count: {
            select: {
              attendees: true,
            },
          },
        },
        where: {
          id: eventId,
        },
      })

      if (!event) {
        throw new Error('Event not found')
      }

      return replay.send({
        event: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          details: event.details,
          eventStart: event.eventStart,
          eventFinish: event.eventFinish,
          maximumAttendees: event.maximumAttendees,
          attendeesAmount: event._count.attendees,
        },
      })
    },
  )
}