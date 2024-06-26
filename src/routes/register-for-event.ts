import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequest } from '../_errors/bad-request'
import { prisma } from '../lib/prisma'

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/attendees',
    {
      schema: {
        summary: 'Register an attendee',
        tags: ['attendee'],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, replay) => {
      const { eventId } = request.params
      const { name, email } = request.body

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            eventId,
            email,
          },
        },
      })

      if (attendeeFromEmail) {
        throw new BadRequest('This email is already registered for this event')
      }

      const [event, amountOfAttendeesForEvent] = await Promise.all([
        await prisma.event.findUnique({
          where: {
            id: eventId,
          },
        }),
        await prisma.attendee.count({
          where: {
            eventId,
          },
        }),
      ])

      if (
        event?.maximumAttendees &&
        amountOfAttendeesForEvent >= event.maximumAttendees
      ) {
        throw new BadRequest(
          'The maximum number of attendees for this event has been reached',
        )
      }

      try {
        const attendee = await prisma.attendee.create({
          data: {
            name,
            email,
            eventId,
          },
        })

        return replay.status(201).send({ attendeeId: attendee.id })
      } catch {
        throw new Error('Error registering attendee for event')
      }
    },
  )
}
