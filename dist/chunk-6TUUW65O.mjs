import {
  BadRequest
} from "./chunk-UX6HP52O.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-attendee-badge.ts
import { z } from "zod";
async function attendeeBadge(app) {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Get attendee badge",
        tags: ["attendee"],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string(),
              eventTitle: z.string(),
              eventStart: z.date(),
              eventFinish: z.date(),
              checkInURL: z.string().url()
            })
          })
        }
      }
    },
    async (request, replay) => {
      const { attendeeId } = request.params;
      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
              eventStart: true,
              eventFinish: true
            }
          }
        },
        where: {
          id: attendeeId
        }
      });
      if (!attendee) {
        throw new BadRequest("Attendee not found");
      }
      const { protocol, hostname } = request;
      const baseURL = `${protocol}://${hostname}`;
      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL);
      return replay.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          eventStart: attendee.event.eventStart,
          eventFinish: attendee.event.eventFinish,
          checkInURL: checkInURL.toString()
        }
      });
    }
  );
}

export {
  attendeeBadge
};
