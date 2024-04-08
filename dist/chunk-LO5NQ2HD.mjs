import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-all-events.ts
import z from "zod";
async function getAllEvents(app) {
  app.withTypeProvider().get(
    "/events",
    {
      schema: {
        summary: "Get all events",
        tags: ["events"],
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
                    eventId: z.string()
                  })
                )
              })
            )
          })
        }
      }
    },
    async (request, replay) => {
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
              attendees: true
            }
          }
        }
      });
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
            attendees: event.attendees
          };
        })
      });
    }
  );
}

export {
  getAllEvents
};
