import {
  BadRequest
} from "./chunk-UX6HP52O.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/delete-event.ts
import { z } from "zod";
async function deleteEvent(app) {
  app.withTypeProvider().delete(
    "/events/:id",
    {
      schema: {
        summary: "Delete an event",
        tags: ["events"],
        params: z.object({
          id: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const eventId = request.params.id;
      const existingEvent = await prisma.event.findUnique({
        where: {
          id: eventId
        }
      });
      if (!existingEvent) {
        throw new BadRequest("Event not found");
      }
      await prisma.event.delete({
        where: {
          id: eventId
        }
      });
      return reply.send({ message: "Event deleted successfully" });
    }
  );
}

export {
  deleteEvent
};
