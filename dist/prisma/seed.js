"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/lib/prisma");
async function seed() {
    await prisma_1.prisma.event.create({
        data: {
            id: '7515206b-222d-4b91-9a23-84e74541585c',
            title: 'Unite Summit 2024',
            slug: 'unite-summit-2024',
            details: 'Um evento p/ devs apaixonados(as) por código!',
            eventStart: new Date('2024-04-01T08:00:00').toISOString(),
            eventFinish: new Date('2024-04-07T23:59:59').toISOString(),
            maximumAttendees: 120,
        },
    });
}
seed().then(() => {
    console.log('');
    console.log(' ***********************************');
    console.log(' * Database seeded successfully 👍 *');
    console.log(' ***********************************');
    prisma_1.prisma.$disconnect();
});
