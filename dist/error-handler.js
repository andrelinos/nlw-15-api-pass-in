"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const bad_request_1 = require("./_errors/bad-request");
const errorHandler = (error, request, replay) => {
    if (error instanceof zod_1.ZodError) {
        return replay.status(400).send({
            message: `Error during validation`,
            errors: error.flatten().fieldErrors,
        });
    }
    if (error instanceof bad_request_1.BadRequest) {
        return replay.status(400).send({ message: error.message });
    }
    return replay.status(500).send({ message: 'Internal server error' });
};
exports.errorHandler = errorHandler;
