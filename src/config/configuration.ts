import { config } from 'dotenv';

config();
import * as process from 'process';

export const getConfiguration = () => ({
  PORT: parseInt(process.env.PORT, 10) ?? 3010,
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
});

export type ConfigType = ReturnType<typeof getConfiguration>;
