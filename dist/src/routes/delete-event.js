"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = void 0;
const zod_1 = require("zod");
const bad_request_1 = require("../_errors/bad-request");
const prisma_1 = require("../lib/prisma");
async function deleteEvent(app) {
    app.withTypeProvider().delete('/events/:id', {
        schema: {
            summary: 'Delete an event',
            tags: ['events'],
            params: zod_1.z.object({
                id: zod_1.z.string().uuid(),
            }),
        },
    }, async (request, reply) => {
        const eventId = request.params.id;
        const existingEvent = await prisma_1.prisma.event.findUnique({
            where: {
                id: eventId,
            },
        });
        if (!existingEvent) {
            throw new bad_request_1.BadRequest('Event not found');
        }
        await prisma_1.prisma.event.delete({
            where: {
                id: eventId,
            },
        });
        return reply.send({ message: 'Event deleted successfully' });
    });
}
exports.deleteEvent = deleteEvent;
