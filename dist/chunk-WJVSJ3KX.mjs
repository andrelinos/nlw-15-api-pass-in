import {
  BadRequest
} from "./chunk-UX6HP52O.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/check-in.ts
import { z } from "zod";
async function checkIn(app) {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        summary: "Check an attendee",
        tags: ["check-in"],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          201: z.null()
        }
      }
    },
    async (request, replay) => {
      const { attendeeId } = request.params;
      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId
        }
      });
      if (attendeeCheckIn) {
        throw new BadRequest("Attendee already checked in!");
      }
      try {
        await prisma.checkIn.create({
          data: {
            attendeeId
          }
        });
      } catch {
        throw new Error("Error checking in");
      }
      return replay.status(201).send();
    }
  );
}

export {
  checkIn
};
