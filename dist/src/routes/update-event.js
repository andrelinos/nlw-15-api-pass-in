"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEvent = void 0;
const zod_1 = require("zod");
const bad_request_1 = require("../_errors/bad-request");
const prisma_1 = require("../lib/prisma");
async function updateEvent(app) {
    app.withTypeProvider().put('/events/:id', {
        schema: {
            summary: 'Update an event',
            tags: ['events'],
            params: zod_1.z.object({
                id: zod_1.z.string().uuid(),
            }),
            body: zod_1.z.object({
                title: zod_1.z.string().min(4).optional(),
                details: zod_1.z.string().nullable().optional(),
                eventStart: zod_1.z.coerce.date().optional(),
                eventFinish: zod_1.z.coerce.date().optional(),
                maximumAttendees: zod_1.z.number().int().positive().nullable().optional(),
            }),
        },
    }, async (request, reply) => {
        const eventId = request.params.id;
        const { title, details, eventStart, eventFinish, maximumAttendees } = request.body;
        const existingEvent = await prisma_1.prisma.event.findUnique({
            where: {
                id: eventId,
            },
        });
        if (!existingEvent) {
            throw new bad_request_1.BadRequest('Event not found');
        }
        const updatedEvent = await prisma_1.prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                title: title || existingEvent.title,
                details: details || existingEvent.details,
                eventStart: eventStart || existingEvent.eventStart,
                eventFinish: eventFinish || existingEvent.eventFinish,
                maximumAttendees: maximumAttendees || existingEvent.maximumAttendees,
            },
        });
        return reply.send(updatedEvent);
    });
}
exports.updateEvent = updateEvent;
