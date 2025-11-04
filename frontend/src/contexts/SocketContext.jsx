// frontend/src/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

// Get socket URL from environment or default
const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  // Remove /api suffix if present
  return apiUrl.replace('/api', '');
};

export const SocketProvider = ({ children }) => {
  const [defaultSocket, setDefaultSocket] = useState(null);
  const [userSocket, setUserSocket] = useState(null);
  const [ownerSocket, setOwnerSocket] = useState(null);
  const [adminSocket, setAdminSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated, getAccessToken } = useAuth();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  
  // Use refs to track sockets for cleanup (avoid dependency issues)
  const socketsRef = useRef({
    default: null,
    user: null,
    owner: null,
    admin: null,
  });

  // Initialize socket connection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect all sockets if not authenticated
      Object.values(socketsRef.current).forEach(sock => {
        if (sock) {
          sock.disconnect();
        }
      });
      
      setDefaultSocket(null);
      setUserSocket(null);
      setOwnerSocket(null);
      setAdminSocket(null);
      setIsConnected(false);
      socketsRef.current = { default: null, user: null, owner: null, admin: null };
      reconnectAttemptsRef.current = 0;
      return;
    }

    const token = getAccessToken();
    if (!token) {
      console.warn('No access token available for socket connection');
      return;
    }

    const socketUrl = getSocketUrl();
    const socketOptions = {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
      timeout: 20000,
    };

    // Initialize default namespace socket
    const defaultSock = io(socketUrl, socketOptions);
    socketsRef.current.default = defaultSock;
    
    defaultSock.on('connect', () => {
      console.log('✅ Default socket connected:', defaultSock.id);
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    });

    defaultSock.on('disconnect', (reason) => {
      console.log('❌ Default socket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, manually reconnect
        defaultSock.connect();
      }
    });

    defaultSock.on('connect_error', (error) => {
      console.error('❌ Default socket connection error:', error.message);
      reconnectAttemptsRef.current++;
      
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
      setIsConnected(false);
    });

    defaultSock.on('error', (error) => {
      console.error('❌ Default socket error:', error);
    });

    setDefaultSocket(defaultSock);

    // Initialize user namespace (for all users)
    const userSock = io(`${socketUrl}/user`, socketOptions);
    socketsRef.current.user = userSock;
    
    userSock.on('connect', () => {
      console.log('✅ User namespace socket connected:', userSock.id);
    });

    userSock.on('disconnect', (reason) => {
      console.log('❌ User namespace socket disconnected:', reason);
    });

    userSock.on('connect_error', (error) => {
      console.error('❌ User namespace connection error:', error.message);
    });

    userSock.on('error', (error) => {
      console.error('❌ User namespace socket error:', error);
    });

    setUserSocket(userSock);

    // Initialize owner namespace (if user is owner or admin)
    if (user.role === 'owner' || user.role === 'admin') {
      const ownerSock = io(`${socketUrl}/owner`, socketOptions);
      socketsRef.current.owner = ownerSock;
      
      ownerSock.on('connect', () => {
        console.log('✅ Owner namespace socket connected:', ownerSock.id);
      });

      ownerSock.on('disconnect', (reason) => {
        console.log('❌ Owner namespace socket disconnected:', reason);
      });

      ownerSock.on('connect_error', (error) => {
        console.error('❌ Owner namespace connection error:', error.message);
      });

      ownerSock.on('error', (error) => {
        console.error('❌ Owner namespace socket error:', error);
      });

      setOwnerSocket(ownerSock);
    }

    // Initialize admin namespace (if user is admin)
    if (user.role === 'admin') {
      const adminSock = io(`${socketUrl}/admin`, socketOptions);
      socketsRef.current.admin = adminSock;
      
      adminSock.on('connect', () => {
        console.log('✅ Admin namespace socket connected:', adminSock.id);
      });

      adminSock.on('disconnect', (reason) => {
        console.log('❌ Admin namespace socket disconnected:', reason);
      });

      adminSock.on('connect_error', (error) => {
        console.error('❌ Admin namespace connection error:', error.message);
      });

      adminSock.on('error', (error) => {
        console.error('❌ Admin namespace socket error:', error);
      });

      setAdminSocket(adminSock);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      // Disconnect all sockets using refs (more reliable)
      Object.values(socketsRef.current).forEach(sock => {
        if (sock) {
          sock.disconnect();
          sock.removeAllListeners();
        }
      });
      
      setDefaultSocket(null);
      setUserSocket(null);
      setOwnerSocket(null);
      setAdminSocket(null);
      setIsConnected(false);
      socketsRef.current = { default: null, user: null, owner: null, admin: null };
      reconnectAttemptsRef.current = 0;
    };
  }, [isAuthenticated, user?.role, user?._id]); // Chỉ theo dõi role và id, không theo dõi toàn bộ user object

  // Helper function to get appropriate socket based on namespace
  const getSocket = useCallback((namespace = 'default') => {
    switch (namespace) {
      case 'user':
        return userSocket;
      case 'owner':
        return ownerSocket;
      case 'admin':
        return adminSocket;
      default:
        return defaultSocket;
    }
  }, [defaultSocket, userSocket, ownerSocket, adminSocket]);

  // Helper function to join facility room
  const joinFacility = useCallback((facilityId, namespace = 'user') => {
    const sock = getSocket(namespace);
    if (sock && isConnected) {
      sock.emit('join_facility', facilityId);
    }
  }, [getSocket, isConnected]);

  // Helper function to leave facility room
  const leaveFacility = useCallback((facilityId, namespace = 'user') => {
    const sock = getSocket(namespace);
    if (sock && isConnected) {
      sock.emit('leave_facility', facilityId);
    }
  }, [getSocket, isConnected]);

  // Helper function to join court room
  const joinCourt = useCallback((courtId, facilityId, namespace = 'user') => {
    const sock = getSocket(namespace);
    if (sock && isConnected) {
      sock.emit('join_court', { courtId, facilityId });
    }
  }, [getSocket, isConnected]);

  // Helper function to leave court room
  const leaveCourt = useCallback((courtId, namespace = 'user') => {
    const sock = getSocket(namespace);
    if (sock && isConnected) {
      sock.emit('leave_court', courtId);
    }
  }, [getSocket, isConnected]);

  const value = {
    // Socket instances
    defaultSocket,
    userSocket,
    ownerSocket,
    adminSocket,
    
    // Connection status
    isConnected,
    
    // Helper functions
    getSocket,
    joinFacility,
    leaveFacility,
    joinCourt,
    leaveCourt,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export default SocketContext;
