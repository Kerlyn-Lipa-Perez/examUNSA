export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    name: process.env.DATABASE_NAME || 'combounsa',
    user: process.env.DATABASE_USER || 'admin',
    password: process.env.DATABASE_PASSWORD || '',
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },

  culqi: {
    publicKey: process.env.CULQI_PUBLIC_KEY,
    secretKey: process.env.CULQI_SECRET_KEY,
  },

  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL || 'Combo UNSA <onboarding@resend.dev>',
  },
});
