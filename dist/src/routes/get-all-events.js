"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEvents = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
async function getAllEvents(app) {
    app.withTypeProvider().get('/events', {
        schema: {
            summary: 'Get all events',
            tags: ['events'],
            response: {
                200: zod_1.default.object({
                    events: zod_1.default.array(zod_1.default.object({
                        id: zod_1.default.string().uuid(),
                        title: zod_1.default.string(),
                        slug: zod_1.default.string(),
                        details: zod_1.default.string().nullable(),
                        eventStart: zod_1.default.date(),
                        eventFinish: zod_1.default.date(),
                        maximumAttendees: zod_1.default.number().int().nullable(),
                        attendeesAmount: zod_1.default.number().int(),
                        attendees: zod_1.default.array(zod_1.default.object({
                            id: zod_1.default.number().int(),
                            name: zod_1.default.string(),
                            email: zod_1.default.string(),
                            createdAt: zod_1.default.date(),
                            eventId: zod_1.default.string(),
                        })),
                    })),
                }),
            },
        },
    }, async (request, replay) => {
        const events = await prisma_1.prisma.event.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                details: true,
                attendees: true,
                eventStart: true,
                eventFinish: true,
                maximumAttendees: true,
                _count: {
                    select: {
                        attendees: true,
                    },
                },
            },
        });
        // if (!events) {
        //   throw new Error('No events not found')
        // }
        return replay.send({
            events: events.map((event) => {
                return {
                    id: event.id,
                    title: event.title,
                    details: event.details,
                    slug: event.slug,
                    eventStart: event.eventStart,
                    eventFinish: event.eventFinish,
                    maximumAttendees: event.maximumAttendees,
                    attendeesAmount: event._count.attendees,
                    attendees: event.attendees,
                };
            }),
        });
    });
}
exports.getAllEvents = getAllEvents;
