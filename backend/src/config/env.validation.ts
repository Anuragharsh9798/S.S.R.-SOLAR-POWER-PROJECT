import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().default('SSR Solar Power Backend'),
  CORS_ORIGIN: Joi.string().default('http://localhost:8080'),
  DATABASE_URL: Joi.string().required().description('PostgreSQL Connection URL'),
  JWT_SECRET: Joi.string().default('ssr_solar_super_secret_jwt_key_2026'),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  THROTTLE_TTL: Joi.number().default(60), // seconds
  THROTTLE_LIMIT: Joi.number().default(100), // requests per TTL
});
