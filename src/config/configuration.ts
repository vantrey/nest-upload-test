import { config } from 'dotenv';
config();
import * as process from 'process';
// import 'dotenv/config';

export const getConfiguration = () => ({
  PORT: parseInt(process.env.PORTT, 10) || 3010,
  dev: { NODE_ENV: process.env.NODE_ENV },
  tokens: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    EXPIRED_REFRESH: process.env.EXPIRED_REFRESH,
    EXPIRED_ACCESS: process.env.EXPIRED_ACCESS,
  },
  database: {
    MONGO_URL: process.env.MONGO_URL,
    PGSQL_URL: process.env.PGSQL_URL,
  },
  email: {
    CLIENT_URL: process.env.CLIENT_URL,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_FROM: process.env.MAIL_FROM,
  },
  aws: {
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    SECRET_ACCESS_KEY2: process.env.SECRET_ACCESS_KEY2,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    ACCESS_KEY_ID2: process.env.ACCESS_KEY_ID2,
    BUCKET: process.env.BUCKET,
    ENDPOINT: process.env.ENDPOINT,
  },
});

export type ConfigType = ReturnType<typeof getConfiguration>;
