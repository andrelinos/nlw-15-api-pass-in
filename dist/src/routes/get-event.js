"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvent = void 0;
const zod_1 = require("zod");
const bad_request_1 = require("../_errors/bad-request");
const prisma_1 = require("../lib/prisma");
async function getEvent(app) {
    app.withTypeProvider().get('/events/:eventId', {
        schema: {
            summary: 'Get an event',
            tags: ['events'],
            params: zod_1.z.object({
                eventId: zod_1.z.string().uuid(),
            }),
            response: {
                200: zod_1.z.object({
                    event: zod_1.z.object({
                        id: zod_1.z.string().uuid(),
                        title: zod_1.z.string(),
                        slug: zod_1.z.string(),
                        details: zod_1.z.string().nullable(),
                        eventStart: zod_1.z.date(),
                        eventFinish: zod_1.z.date(),
                        maximumAttendees: zod_1.z.number().int().nullable(),
                        attendeesAmount: zod_1.z.number().int(),
                    }),
                }),
            },
        },
    }, async (request, replay) => {
        const { eventId } = request.params;
        const event = await prisma_1.prisma.event.findUnique({
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
                        attendees: true,
                    },
                },
            },
            where: {
                id: eventId,
            },
        });
        if (!event) {
            throw new bad_request_1.BadRequest('Event not found');
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
                attendeesAmount: event._count.attendees,
            },
        });
    });
}
exports.getEvent = getEvent;
