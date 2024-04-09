"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIn = void 0;
const zod_1 = require("zod");
const bad_request_1 = require("../_errors/bad-request");
const prisma_1 = require("../lib/prisma");
async function checkIn(app) {
    app.withTypeProvider().get('/attendees/:attendeeId/check-in', {
        schema: {
            summary: 'Check an attendee',
            tags: ['check-in'],
            params: zod_1.z.object({
                attendeeId: zod_1.z.coerce.number().int(),
            }),
            response: {
                201: zod_1.z.null(),
            },
        },
    }, async (request, replay) => {
        const { attendeeId } = request.params;
        const attendeeCheckIn = await prisma_1.prisma.checkIn.findUnique({
            where: {
                attendeeId,
            },
        });
        if (attendeeCheckIn) {
            throw new bad_request_1.BadRequest('Attendee already checked in!');
        }
        try {
            await prisma_1.prisma.checkIn.create({
                data: {
                    attendeeId,
                },
            });
        }
        catch {
            throw new Error('Error checking in');
        }
        return replay.status(201).send();
    });
}
exports.checkIn = checkIn;
