"use strict";
/**
 * contact-form-submission controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s]+$/;
const PHONE_REGEX = /^\d{10}$/;
const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
exports.default = strapi_1.factories.createCoreController('api::contact-form-submission.contact-form-submission', ({ strapi }) => ({
    async send(ctx) {
        var _a, _b, _c, _d, _e, _f;
        const body = (_a = ctx.request.body) !== null && _a !== void 0 ? _a : {};
        const name = String((_b = body.name) !== null && _b !== void 0 ? _b : '').trim();
        const phone = String((_c = body.phone) !== null && _c !== void 0 ? _c : '').trim();
        const email = String((_d = body.email) !== null && _d !== void 0 ? _d : '').trim();
        const subject = String((_e = body.subject) !== null && _e !== void 0 ? _e : '').trim();
        const message = String((_f = body.message) !== null && _f !== void 0 ? _f : '').trim();
        const hasVoiceMessage = Boolean(body.hasVoiceMessage);
        if (!NAME_REGEX.test(name)) {
            return ctx.badRequest('Name must contain only alphabets');
        }
        if (!PHONE_REGEX.test(phone)) {
            return ctx.badRequest('Phone must be 10 digits numeric');
        }
        if (email && !EMAIL_REGEX.test(email)) {
            return ctx.badRequest('Invalid email format');
        }
        if (!message && !hasVoiceMessage) {
            return ctx.badRequest('Please enter a message or record a voice message');
        }
        const recipient = process.env.CONTACT_RECEIVER || process.env.SMTP_REPLY_TO || 'law.samanyayik@gmail.com';
        const safeSubject = subject || 'No subject';
        const safeMessage = message || '[Voice message only - no text entered]';
        try {
            await strapi.plugin('email').service('email').send({
                to: recipient,
                replyTo: email || process.env.SMTP_REPLY_TO || process.env.SMTP_FROM,
                subject: `Contact Form: ${safeSubject}`,
                text: [
                    'New contact form submission',
                    `Name: ${name}`,
                    `Phone: ${phone}`,
                    `Email: ${email || 'Not provided'}`,
                    `Subject: ${safeSubject}`,
                    `Has voice message: ${hasVoiceMessage ? 'Yes' : 'No'}`,
                    '',
                    'Message:',
                    safeMessage,
                ].join('\n'),
                html: `
						<h2>New contact form submission</h2>
						<p><strong>Name:</strong> ${escapeHtml(name)}</p>
						<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
						<p><strong>Email:</strong> ${escapeHtml(email || 'Not provided')}</p>
						<p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
						<p><strong>Has voice message:</strong> ${hasVoiceMessage ? 'Yes' : 'No'}</p>
						<p><strong>Message:</strong></p>
						<p>${escapeHtml(safeMessage).replace(/\n/g, '<br/>')}</p>
					`,
            });
            ctx.body = { ok: true, message: 'Message sent successfully.' };
        }
        catch (error) {
            strapi.log.error('Failed to send contact form email', error);
            return ctx.internalServerError('Could not send message right now. Please try again later.');
        }
    },
}));
