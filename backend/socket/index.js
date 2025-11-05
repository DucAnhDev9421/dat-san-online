// backend/socket/index.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import User from '../models/User.js';
import userSocket from './userSocket.js';
import ownerSocket from './ownerSocket.js';
import adminSocket from './adminSocket.js';
import bookingSocket from './bookingSocket.js';

let io;

/**
 * Socket authentication middleware
 */
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || 
                  socket.handshake.headers.authorization?.replace('Bearer ', '') ||
                  socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Get user from database
    const user = await User.findById(decoded.userId)
      .select('-password -refreshTokens')
      .lean();

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    if (!user.isActive) {
      return next(new Error('Authentication error: User account is not active'));
    }

    if (user.isLocked) {
      return next(new Error('Authentication error: User account is locked'));
    }

    // Attach user info to socket
    socket.userId = user._id.toString();
    socket.userRole = user.role;
    socket.user = user;
    
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication error: Invalid or expired token'));
  }
};

/**
 * Initialize Socket.IO server
 */
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.frontendUrl,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Apply authentication to default namespace
  io.use(authenticateSocket);

  // Initialize namespaces
  const userNamespace = io.of('/user');
  const ownerNamespace = io.of('/owner');
  const adminNamespace = io.of('/admin');

  // Apply authentication to all namespaces
  userNamespace.use(authenticateSocket);
  ownerNamespace.use(authenticateSocket);
  adminNamespace.use(authenticateSocket);

  // Setup namespace handlers
  userSocket(userNamespace);
  ownerSocket(ownerNamespace);
  adminSocket(adminNamespace);

  // Booking socket (shared across all namespaces)
  bookingSocket(io);

  // Default namespace connection handler
  io.on('connection', (socket) => {
    console.log(`✅ Socket connected [default]: ${socket.userId} (${socket.user.email}) - Role: ${socket.userRole}`);

    // Join user's personal room
    socket.join(`user_${socket.userId}`);

    // Join role-based rooms
    if (socket.userRole === 'owner') {
      socket.join('owners');
    }
    if (socket.userRole === 'admin') {
      socket.join('admins');
    }

    // Handle join facility room (for receiving facility-specific updates)
    socket.on('join_facility', (facilityId) => {
      if (!facilityId) {
        socket.emit('error', { message: 'Facility ID is required' });
        return;
      }
      socket.join(`facility_${facilityId}`);
      console.log(`📌 User ${socket.userId} joined facility room [default]: ${facilityId}`);
      socket.emit('joined_facility', { facilityId });
    });

    // Handle leave facility room
    socket.on('leave_facility', (facilityId) => {
      if (!facilityId) return;
      socket.leave(`facility_${facilityId}`);
      console.log(`👋 User ${socket.userId} left facility room [default]: ${facilityId}`);
      socket.emit('left_facility', { facilityId });
    });

    // Handle join court room (for real-time slot updates)
    socket.on('join_court', (data) => {
      const { courtId, facilityId } = typeof data === 'object' ? data : { courtId: data, facilityId: null };
      if (!courtId) {
        socket.emit('error', { message: 'Court ID is required' });
        return;
      }
      socket.join(`court_${courtId}`);
      console.log(`📌 User ${socket.userId} joined court room [default]: ${courtId}`);
      socket.emit('joined_court', { courtId, facilityId });
    });

    // Handle leave court room
    socket.on('leave_court', (courtId) => {
      if (!courtId) return;
      socket.leave(`court_${courtId}`);
      console.log(`👋 User ${socket.userId} left court room [default]: ${courtId}`);
      socket.emit('left_court', { courtId });
    });

    socket.on('disconnect', (reason) => {
      console.log(`❌ Socket disconnected [default]: ${socket.userId} - Reason: ${reason}`);
    });

    socket.on('error', (error) => {
      console.error(`❌ Socket error [default]: ${socket.userId}`, error);
    });
  });

  console.log('🔌 Socket.IO server initialized with namespaces');
  return io;
};

/**
 * Get Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket() first.');
  }
  return io;
};

/**
 * Helper functions to emit events
 */
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

export const emitToFacility = (facilityId, event, data) => {
  if (io) {
    io.to(`facility_${facilityId}`).emit(event, data);
  }
};

export const emitToOwners = (event, data) => {
  if (io) {
    io.to('owners').emit(event, data);
  }
};

export const emitToAdmins = (event, data) => {
  if (io) {
    io.to('admins').emit(event, data);
  }
};

export const emitToNamespace = (namespace, event, data) => {
  if (io) {
    const ns = io.of(`/${namespace}`);
    ns.emit(event, data);
  }
};

export default io;
