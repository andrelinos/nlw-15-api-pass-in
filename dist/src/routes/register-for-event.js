"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerForEvent = void 0;
const zod_1 = require("zod");
const bad_request_1 = require("../_errors/bad-request");
const prisma_1 = require("../lib/prisma");
async function registerForEvent(app) {
    app.withTypeProvider().post('/events/:eventId/attendees', {
        schema: {
            summary: 'Register an attendee',
            tags: ['attendee'],
            body: zod_1.z.object({
                name: zod_1.z.string().min(4),
                email: zod_1.z.string().email(),
            }),
            params: zod_1.z.object({
                eventId: zod_1.z.string().uuid(),
            }),
            response: {
                201: zod_1.z.object({
                    attendeeId: zod_1.z.number(),
                }),
            },
        },
    }, async (request, replay) => {
        const { eventId } = request.params;
        const { name, email } = request.body;
        const attendeeFromEmail = await prisma_1.prisma.attendee.findUnique({
            where: {
                eventId_email: {
                    eventId,
                    email,
                },
            },
        });
        if (attendeeFromEmail) {
            throw new bad_request_1.BadRequest('This email is already registered for this event');
        }
        const [event, amountOfAttendeesForEvent] = await Promise.all([
            await prisma_1.prisma.event.findUnique({
                where: {
                    id: eventId,
                },
            }),
            await prisma_1.prisma.attendee.count({
                where: {
                    eventId,
                },
            }),
        ]);
        if (event?.maximumAttendees &&
            amountOfAttendeesForEvent >= event.maximumAttendees) {
            throw new bad_request_1.BadRequest('The maximum number of attendees for this event has been reached');
        }
        try {
            const attendee = await prisma_1.prisma.attendee.create({
                data: {
                    name,
                    email,
                    eventId,
                },
            });
            return replay.status(201).send({ attendeeId: attendee.id });
        }
        catch {
            throw new Error('Error registering attendee for event');
        }
    });
}
exports.registerForEvent = registerForEvent;
