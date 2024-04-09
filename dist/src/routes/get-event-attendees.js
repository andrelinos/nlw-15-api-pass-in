"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventAttendees = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
async function getEventAttendees(app) {
    app.withTypeProvider().get('/events/:eventId/attendees', {
        schema: {
            summary: 'Get event attendees',
            tags: ['events'],
            params: zod_1.z.object({
                eventId: zod_1.z.string().uuid(),
            }),
            querystring: zod_1.z.object({
                query: zod_1.z.string().nullish(),
                pageIndex: zod_1.z.string().nullable().default('0').transform(Number),
                perPage: zod_1.z.string().nullable().default('10').transform(Number),
            }),
            response: {
                200: zod_1.z.object({
                    attendees: zod_1.z.array(zod_1.z.object({
                        id: zod_1.z.number(),
                        name: zod_1.z.string(),
                        email: zod_1.z.string().email(),
                        createdAt: zod_1.z.date(),
                        checkedInAt: zod_1.z.date().nullable(),
                    })),
                }),
            },
        },
    }, async (request, replay) => {
        const { eventId } = request.params;
        const { pageIndex, perPage, query } = request.query;
        const attendees = await prisma_1.prisma.attendee.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                checkIn: {
                    select: {
                        createdAt: true,
                    },
                },
            },
            where: query
                ? {
                    eventId,
                    name: {
                        contains: query,
                        mode: 'insensitive',
                    },
                }
                : {
                    eventId,
                },
            take: perPage,
            skip: pageIndex * perPage,
        });
        return replay.send({
            attendees: attendees.map((attendee) => {
                return {
                    id: attendee.id,
                    name: attendee.name,
                    email: attendee.email,
                    createdAt: attendee.createdAt,
                    checkedInAt: attendee.checkIn?.createdAt || null,
                };
            }),
        });
    });
}
exports.getEventAttendees = getEventAttendees;
