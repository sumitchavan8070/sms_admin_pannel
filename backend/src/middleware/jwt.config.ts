// src/config/jwt.config.ts
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'defaultSecret',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};