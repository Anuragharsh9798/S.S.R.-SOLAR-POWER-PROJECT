import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().default('SSR Solar Power Backend'),
  CORS_ORIGIN: Joi.string().default('http://localhost:8080'),
  DATABASE_URL: Joi.string().required().description('PostgreSQL Connection URL'),
  JWT_SECRET: Joi.string()
    .required()
    .min(32)
    .description('Strong cryptographically secure JWT secret (minimum 32 characters) is required'),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  THROTTLE_TTL: Joi.number().default(60), // seconds
  THROTTLE_LIMIT: Joi.number().default(100), // requests per TTL
  // Email notification configuration (EmailJS REST API)
  EMAILJS_SERVICE_ID: Joi.string().optional().allow(''),
  EMAILJS_TEMPLATE_ID: Joi.string().optional().allow(''),
  EMAILJS_PUBLIC_KEY: Joi.string().optional().allow(''),
  EMAILJS_PRIVATE_KEY: Joi.string().optional().allow(''),
  EMAILJS_USER_ID: Joi.string().optional().allow(''),
  EMAILJS_ACCESS_TOKEN: Joi.string().optional().allow(''),
  ADMIN_NOTIFICATION_EMAIL: Joi.string().email().optional().allow(''),
  // Aliases for compatibility with Vite env naming
  VITE_EMAILJS_SERVICE_ID: Joi.string().optional().allow(''),
  VITE_EMAILJS_TEMPLATE_ID: Joi.string().optional().allow(''),
  VITE_EMAILJS_PUBLIC_KEY: Joi.string().optional().allow(''),
});
