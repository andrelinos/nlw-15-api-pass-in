"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url().min(1),
    API_BASE_URL: zod_1.z.string().url().min(1),
    PORT: zod_1.z.coerce.number().optional(),
});
exports.env = envSchema.parse(process.env);
