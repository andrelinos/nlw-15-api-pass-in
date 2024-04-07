import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequest } from '../_errors/bad-request'
import { prisma } from '../lib/prisma'

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:attendeeId/check-in',
    {
      schema: {
        summary: 'Check an attendee',
        tags: ['check-in'],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, replay) => {
      const { attendeeId } = request.params

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId,
        },
      })

      if (attendeeCheckIn) {
        throw new BadRequest('Attendee already checked in!')
      }

      try {
        await prisma.checkIn.create({
          data: {
            attendeeId,
          },
        })
      } catch {
        throw new Error('Error checking in')
      }

      return replay.status(201).send()
    },
  )
}
