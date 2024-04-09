import { FastifyInstance } from 'fastify/types/instance'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequest } from '../_errors/bad-request'
import { prisma } from '../lib/prisma'

export async function updateEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/events/:id',
    {
      schema: {
        summary: 'Update an event',
        tags: ['events'],
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4).optional(),
          details: z.string().nullable().optional(),
          eventStart: z.coerce.date().optional(),
          eventFinish: z.coerce.date().optional(),
          maximumAttendees: z.number().int().positive().nullable().optional(),
        }),
      },
    },
    async (request, reply) => {
      const eventId = request.params.id
      const { title, details, eventStart, eventFinish, maximumAttendees } =
        request.body

      const existingEvent = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      })

      if (!existingEvent) {
        throw new BadRequest('Event not found')
      }

      const updatedEvent = await prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          title: title || existingEvent.title,
          details: details || existingEvent.details,
          eventStart: eventStart || existingEvent.eventStart,
          eventFinish: eventFinish || existingEvent.eventFinish,
          maximumAttendees: maximumAttendees || existingEvent.maximumAttendees,
        },
      })

      return reply.send(updatedEvent)
    },
  )
}
