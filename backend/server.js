import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

// Import configurations
import { config, validateConfig } from "./config/config.js";
import { connectDB } from "./config/database.js";
import "./config/passport.js";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import auditRoutes from "./routes/audit.js";
import facilityRoutes from "./routes/facility.js";
import courtRoutes from "./routes/court.js";
import User from "./models/User.js";

const app = express();

// Validate configuration
validateConfig();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/courts", courtRoutes);
// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Frontend URL: ${config.frontendUrl}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Google OAuth: http://localhost:${PORT}/api/auth/google`);
});

// Schedule cleanup job for unverified users every hour
setInterval(async () => {
  try {
    const result = await User.cleanupUnverifiedUsers();
    console.log(`🧹 Cleaned up ${result.deletedCount} unverified user(s)`);
  } catch (error) {
    console.error("Error cleaning up unverified users:", error);
  }
}, 60 * 60 * 1000); // Run every hour

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  process.exit(0);
});
