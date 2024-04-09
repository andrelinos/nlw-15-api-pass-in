import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '../lib/prisma'

export async function getAllEvents(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events',
    {
      schema: {
        summary: 'Get all events',
        tags: ['events'],
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullable().default('0').transform(Number),
          perPage: z.string().nullable().default('10').transform(Number),
        }),
        response: {
          200: z.object({
            events: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                slug: z.string(),
                details: z.string().nullable(),
                eventStart: z.date(),
                eventFinish: z.date(),
                maximumAttendees: z.number().int().nullable(),
                attendeesAmount: z.number().int(),
                attendees: z.array(
                  z.object({
                    id: z.number().int(),
                    name: z.string(),
                    email: z.string(),
                    createdAt: z.date(),
                    eventId: z.string(),
                  }),
                ),
              }),
            ),
          }),
        },
      },
    },
    async (request, replay) => {
      const { pageIndex, perPage, query } = request.query

      const events = await prisma.event.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          attendees: true,
          eventStart: true,
          eventFinish: true,
          maximumAttendees: true,
          _count: {
            select: {
              attendees: true,
            },
          },
        },
        where: query
          ? {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            }
          : {},
        take: perPage,
        skip: pageIndex * perPage,
      })

      return replay.send({
        events: events.map((event) => {
          return {
            id: event.id,
            title: event.title,
            details: event.details,
            slug: event.slug,
            eventStart: event.eventStart,
            eventFinish: event.eventFinish,
            maximumAttendees: event.maximumAttendees,
            attendeesAmount: event._count.attendees,
            attendees: event.attendees,
          }
        }),
      })
    },
  )
}
