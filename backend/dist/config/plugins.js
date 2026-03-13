"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST', 'smtp.gmail.com'),
                port: env.int('SMTP_PORT', 587),
                secure: env.bool('SMTP_SECURE', false),
                auth: {
                    user: env('SMTP_USERNAME', env('SMTP_USER')),
                    pass: env('SMTP_PASSWORD', env('SMTP_PASS')),
                },
            },
            settings: {
                defaultFrom: env('SMTP_FROM', 'law.samanyayik@gmail.com'),
                defaultReplyTo: env('SMTP_REPLY_TO', 'law.samanyayik@gmail.com'),
            },
        },
    },
});
