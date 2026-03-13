"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/contact-form-submissions/send',
            handler: 'contact-form-submission.send',
            config: {
                auth: false,
            },
        },
    ],
};
