import {
  BadRequest
} from "./chunk-UX6HP52O.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-event.ts
import { z } from "zod";
async function getEvent(app) {
  app.withTypeProvider().get(
    "/events/:eventId",
    {
      schema: {
        summary: "Get an event",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid()
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
              attendeesAmount: z.number().int()
            })
          })
        }
      }
    },
    async (request, replay) => {
      const { eventId } = request.params;
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
              attendees: true
            }
          }
        },
        where: {
          id: eventId
        }
      });
      if (!event) {
        throw new BadRequest("Event not found");
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
          attendeesAmount: event._count.attendees
        }
      });
    }
  );
}

export {
  getEvent
};
