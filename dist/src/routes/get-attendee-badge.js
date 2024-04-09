"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendeeBadge = void 0;
const zod_1 = require("zod");
const bad_request_1 = require("../_errors/bad-request");
const prisma_1 = require("../lib/prisma");
async function attendeeBadge(app) {
    app.withTypeProvider().get('/attendees/:attendeeId/badge', {
        schema: {
            summary: 'Get attendee badge',
            tags: ['attendee'],
            params: zod_1.z.object({
                attendeeId: zod_1.z.coerce.number().int(),
            }),
            response: {
                200: zod_1.z.object({
                    badge: zod_1.z.object({
                        name: zod_1.z.string(),
                        email: zod_1.z.string(),
                        eventTitle: zod_1.z.string(),
                        eventStart: zod_1.z.date(),
                        eventFinish: zod_1.z.date(),
                        checkInURL: zod_1.z.string().url(),
                    }),
                }),
            },
        },
    }, async (request, replay) => {
        const { attendeeId } = request.params;
        const attendee = await prisma_1.prisma.attendee.findUnique({
            select: {
                name: true,
                email: true,
                event: {
                    select: {
                        title: true,
                        eventStart: true,
                        eventFinish: true,
                    },
                },
            },
            where: {
                id: attendeeId,
            },
        });
        if (!attendee) {
            throw new bad_request_1.BadRequest('Attendee not found');
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
                checkInURL: checkInURL.toString(),
            },
        });
    });
}
exports.attendeeBadge = attendeeBadge;
