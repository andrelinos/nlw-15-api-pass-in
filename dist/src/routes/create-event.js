"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = void 0;
const zod_1 = require("zod");
const bad_request_1 = require("../_errors/bad-request");
const prisma_1 = require("../lib/prisma");
const generate_slug_1 = require("../utils/generate-slug");
async function createEvent(app) {
    app.withTypeProvider().post('/events', {
        schema: {
            summary: 'Create an event',
            tags: ['events'],
            body: zod_1.z.object({
                title: zod_1.z.string().min(4),
                details: zod_1.z.string().nullable(),
                eventStart: zod_1.z.coerce.date(),
                eventFinish: zod_1.z.coerce.date(),
                maximumAttendees: zod_1.z.number().int().positive().nullable(),
            }),
            response: {
                201: zod_1.z.object({
                    eventId: zod_1.z.string().uuid(),
                }),
            },
        },
    }, async (request, replay) => {
        const { title, details, eventStart, eventFinish, maximumAttendees } = request.body;
        const slug = (0, generate_slug_1.generateSlug)(title);
        const eventWithSameSlug = await prisma_1.prisma.event.findUnique({
            where: {
                slug,
            },
        });
        if (eventWithSameSlug) {
            throw new bad_request_1.BadRequest('Another event with same title already exists');
        }
        const event = await prisma_1.prisma.event.create({
            data: {
                title,
                details,
                eventStart,
                eventFinish,
                maximumAttendees,
                slug,
            },
        });
        return replay.status(201).send({ eventId: event.id });
    });
}
exports.createEvent = createEvent;
