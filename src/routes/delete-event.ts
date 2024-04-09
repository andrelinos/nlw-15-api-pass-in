import { FastifyInstance } from 'fastify/types/instance'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequest } from '../_errors/bad-request'
import { prisma } from '../lib/prisma'

export async function deleteEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/events/:id',
    {
      schema: {
        summary: 'Delete an event',
        tags: ['events'],
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const eventId = request.params.id

      const existingEvent = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      })

      if (!existingEvent) {
        throw new BadRequest('Event not found')
      }

      await prisma.event.delete({
        where: {
          id: eventId,
        },
      })

      return reply.send({ message: 'Event deleted successfully' })
    },
  )
}
