// backend/socket/ownerSocket.js
import Facility from '../models/Facility.js';

/**
 * Owner namespace socket handlers
 * Handles events for facility owners
 */
export default function ownerSocket(namespace) {
  namespace.on('connection', async (socket) => {
    console.log(`✅ Owner connected [/owner]: ${socket.userId} (${socket.user.email})`);

    // Verify user is actually an owner
    if (socket.userRole !== 'owner' && socket.userRole !== 'admin') {
      socket.emit('error', { message: 'Access denied: Owner namespace requires owner role' });
      socket.disconnect();
      return;
    }

    // Join owner rooms
    socket.join('owners');
    socket.join(`owner_${socket.userId}`);

    // Auto-join all facilities owned by this user
    try {
      const facilities = await Facility.find({ owner: socket.userId })
        .select('_id name')
        .lean();

      facilities.forEach(facility => {
        socket.join(`facility_${facility._id}`);
        console.log(`📌 Owner ${socket.userId} auto-joined facility: ${facility.name} (${facility._id})`);
      });
    } catch (error) {
      console.error(`Error loading owner facilities: ${error.message}`);
    }

    // Handle join facility room
    socket.on('join_facility', async (facilityId) => {
      if (!facilityId) {
        socket.emit('error', { message: 'Facility ID is required' });
        return;
      }

      try {
        // Verify ownership
        const facility = await Facility.findById(facilityId).select('owner').lean();
        if (!facility) {
          socket.emit('error', { message: 'Facility not found' });
          return;
        }

        const facilityOwnerId = facility.owner?.toString() || facility.owner;
        if (facilityOwnerId !== socket.userId && socket.userRole !== 'admin') {
          socket.emit('error', { message: 'You do not own this facility' });
          return;
        }

        socket.join(`facility_${facilityId}`);
        console.log(`📌 Owner ${socket.userId} joined facility room: ${facilityId}`);
        socket.emit('joined_facility', { facilityId });
      } catch (error) {
        socket.emit('error', { message: 'Error joining facility room' });
        console.error('Error in join_facility:', error);
      }
    });

    // Handle leave facility room
    socket.on('leave_facility', (facilityId) => {
      if (!facilityId) return;
      socket.leave(`facility_${facilityId}`);
      console.log(`👋 Owner ${socket.userId} left facility room: ${facilityId}`);
      socket.emit('left_facility', { facilityId });
    });

    // Handle request facility stats
    socket.on('get_facility_stats', async (facilityId) => {
      // This can be extended to fetch real-time stats
      socket.emit('facility_stats', { facilityId, stats: {} });
    });

    // Handle ping
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`❌ Owner disconnected [/owner]: ${socket.userId} - Reason: ${reason}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`❌ Owner socket error [/owner]: ${socket.userId}`, error);
    });
  });

  console.log('✅ Owner namespace initialized');
}
