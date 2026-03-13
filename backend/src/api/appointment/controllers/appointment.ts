/**
 * appointment controller
 */

import { factories } from '@strapi/strapi';
import { Readable } from 'stream';

type TurnstileVerifyResult = {
  success: boolean;
  [key: string]: unknown;
};

export default factories.createCoreController('api::appointment.appointment', ({ strapi }) => ({
  async create(ctx) {
    const { data, captchaToken } = ctx.request.body;

    // Validate required fields
    if (!data || !data.date || !data.time || !data.name || !data.phone || !data.consultationType) {
      return ctx.badRequest('Missing required fields: date, time, name, phone, consultationType');
    }

    // Validate CAPTCHA token
    if (!captchaToken) {
      return ctx.badRequest('Invalid human verification');
    }

  try {
      const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || process.env.VITE_RECAPTCHA_SECRET_KEY;
      if (!recaptchaSecret) {
        strapi.log.error('RECAPTCHA_SECRET_KEY is not set in environment variables');
        return ctx.internalServerError('Server configuration error');
      }

      const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(captchaToken)}`,
      });

      type RecaptchaVerifyResult = {
        success: boolean;
        score?: number;
        'error-codes'?: string[];
        [key: string]: unknown;
      };

      const verifyResult = (await verifyResponse.json()) as RecaptchaVerifyResult;

      if (!verifyResult.success || (verifyResult.score ?? 0) < 0.5) {
        strapi.log.warn('reCAPTCHA verification failed:', verifyResult);
        return ctx.badRequest('Captcha verification failed');
      }

      // Sanitize input to prevent XSS
      const sanitizedData: any = {
        date: data.date,
        time: String(data.time).trim(),
        name: String(data.name).trim(),
        phone: String(data.phone).trim(),
        consultationType: data.consultationType,
      };

      // Optional fields with sanitization
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return ctx.badRequest('Invalid email format');
        }
        sanitizedData.email = String(data.email).trim();
      }

      if (data.address) {
        sanitizedData.address = String(data.address).trim();
      }

      if (data.coordinates && typeof data.coordinates === 'object') {
        sanitizedData.coordinates = {
          lat: Number(data.coordinates.lat) || 0,
          lng: Number(data.coordinates.lng) || 0,
        };
      }

      if (data.issue) {
        // Validate blocks structure
        if (Array.isArray(data.issue)) {
          sanitizedData.issue = data.issue;
        }
      }

      if (data.voiceMessageFile && typeof data.voiceMessageFile === 'object') {
        const { filename, mime, base64 } = data.voiceMessageFile as { filename: string; mime: string; base64: string };
        if (filename && mime && base64) {
          const buffer = Buffer.from(base64, 'base64');
          const uploadConfig = strapi.config.get('plugin.upload') as any;
          const entity: any = {
            name: filename,
            hash: filename.replace(/\.[^/.]+$/, ''),
            ext: filename.includes('.') ? filename.slice(filename.lastIndexOf('.')) : '',
            mime,
            size: buffer.length,
            provider: uploadConfig?.provider || 'local',
            getStream: () => Readable.from(buffer),
          };
          await strapi.plugin('upload').service('provider').upload(entity);
          const fileRecord = await strapi.query('plugin::upload.file').create({ data: entity });
          if (fileRecord?.id) {
            sanitizedData.voiceMessage = fileRecord.id;
          }
        }
      }

      if (data.voiceMessage) {
        // Validate that voiceMessage is a valid media ID
        const mediaId = Number(data.voiceMessage);
        if (!isNaN(mediaId) && mediaId > 0) {
          // Verify the media file exists using entity service
          const mediaFile = await strapi.entityService.findOne('plugin::upload.file', mediaId);
          if (!mediaFile) {
            return ctx.badRequest('Invalid voice message file');
          }
          sanitizedData.voiceMessage = mediaId;
        } else {
          return ctx.badRequest('Invalid voice message ID');
        }
      }

      // Create the appointment using Strapi v5 entity service
      const appointment = await strapi.entityService.create('api::appointment.appointment', {
        data: sanitizedData,
      });

      // Return success response
      return ctx.created({
        message: 'Booking submitted successfully',
        data: {
          id: appointment.id,
          name: appointment.name,
          date: appointment.date,
        },
      });
    } catch (error) {
      strapi.log.error('Error creating appointment:', error);
      return ctx.internalServerError('Failed to create appointment');
    }
  },
}));
