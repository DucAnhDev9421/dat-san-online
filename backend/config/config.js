import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // MongoDB Configuration
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dat-san-online',

  // Google OAuth2 Configuration
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id_here',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret_here',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_random',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // Session Configuration
  sessionSecret: process.env.SESSION_SECRET || 'your_super_secret_session_key_here_make_it_long_and_random',

  // Frontend URL (for CORS)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Cloudinary Configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};

// Validation function
export const validateConfig = () => {
  const required = [
    'google.clientId',
    'google.clientSecret',
    'jwt.secret',
    'sessionSecret'
  ];

  const missing = required.filter(key => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config);
    return !value || value.includes('your_') || value.includes('_here');
  });

  if (missing.length > 0) {
    console.warn('⚠️  Cảnh báo: Các biến môi trường sau cần được cấu hình:');
    missing.forEach(key => console.warn(`   - ${key.toUpperCase()}`));
    console.warn('   Vui lòng tạo file .env và cấu hình các giá trị này.');
  }
};
