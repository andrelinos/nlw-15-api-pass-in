import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '../lib/prisma'

export async function attendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:attendeeId/badge',
    {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string(),
              eventTitle: z.string(),
              eventStart: z.date(),
              eventFinish: z.date(),
              checkInURL: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, replay) => {
      const { attendeeId } = request.params

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
              eventStart: true,
              eventFinish: true,
            },
          },
        },
        where: {
          id: attendeeId,
        },
      })

      if (!attendee) {
        throw new Error('Attendee not found')
      }

      const { protocol, hostname } = request
      const baseURL = `${protocol}://${hostname}`

      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

      return replay.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          eventStart: attendee.event.eventStart,
          eventFinish: attendee.event.eventFinish,
          checkInURL: checkInURL.toString(),
        },
      })
    },
  )
}
