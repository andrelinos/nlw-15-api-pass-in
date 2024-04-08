import {
  generateSlug
} from "./chunk-KDMJHR3Z.mjs";
import {
  BadRequest
} from "./chunk-UX6HP52O.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-event.ts
import { z } from "zod";
async function createEvent(app) {
  app.withTypeProvider().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          eventStart: z.coerce.date(),
          eventFinish: z.coerce.date(),
          maximumAttendees: z.number().int().positive().nullable()
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid()
          })
        }
      }
    },
    async (request, replay) => {
      const { title, details, eventStart, eventFinish, maximumAttendees } = request.body;
      const slug = generateSlug(title);
      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug
        }
      });
      if (eventWithSameSlug) {
        throw new BadRequest("Another event with same title already exists");
      }
      const event = await prisma.event.create({
        data: {
          title,
          details,
          eventStart,
          eventFinish,
          maximumAttendees,
          slug
        }
      });
      return replay.status(201).send({ eventId: event.id });
    }
  );
}

export {
  createEvent
};
