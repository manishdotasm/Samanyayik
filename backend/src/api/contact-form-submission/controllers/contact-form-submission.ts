/**
 * contact-form-submission controller
 */

import { factories } from '@strapi/strapi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s]+$/;
const PHONE_REGEX = /^\d{10}$/;

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

export default factories.createCoreController(
	'api::contact-form-submission.contact-form-submission',
	({ strapi }) => ({
		async send(ctx) {
			const body = ctx.request.body ?? {};
			const name = String(body.name ?? '').trim();
			const phone = String(body.phone ?? '').trim();
			const email = String(body.email ?? '').trim();
			const subject = String(body.subject ?? '').trim();
			const message = String(body.message ?? '').trim();
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

			const recipient =
				process.env.CONTACT_RECEIVER || process.env.SMTP_REPLY_TO || 'law.samanyayik@gmail.com';
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
			} catch (error) {
				strapi.log.error('Failed to send contact form email', error as Error);
				return ctx.internalServerError('Could not send message right now. Please try again later.');
			}
		},
	})
);
