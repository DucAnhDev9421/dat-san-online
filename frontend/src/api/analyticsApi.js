import { api, handleApiError, handleApiSuccess } from './axiosClient';

/**
 * Analytics API Service
 * 
 * This file handles analytics-related API operations for owners:
 * - Dashboard statistics
 * - Revenue analytics
 * - Booking analytics
 * - Court statistics
 */

export const analyticsApi = {
  /**
   * Get owner dashboard statistics
   * GET /api/analytics/owner/dashboard?facilityId=xxx&period=month
   * @param {String} facilityId - Facility ID
   * @param {String} period - Period: 'day', 'week', 'month' (default: 'month')
   * @returns {Promise} Dashboard statistics
   */
  getOwnerDashboard: async (facilityId, period = 'month') => {
    try {
      if (!facilityId) {
        throw new Error('facilityId is required');
      }
      const response = await api.get('/analytics/owner/dashboard', {
        params: { facilityId, period },
      });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get owner revenue statistics
   * GET /api/analytics/owner/revenue?facilityId=xxx&startDate=xxx&endDate=xxx
   * @param {String} facilityId - Facility ID
   * @param {String} startDate - Start date (YYYY-MM-DD)
   * @param {String} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} Revenue statistics
   */
  getOwnerRevenue: async (facilityId, startDate, endDate) => {
    try {
      if (!facilityId) {
        throw new Error('facilityId is required');
      }
      const params = { facilityId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/analytics/owner/revenue', { params });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get owner booking statistics
   * GET /api/analytics/owner/bookings?facilityId=xxx&startDate=xxx&endDate=xxx
   * @param {String} facilityId - Facility ID
   * @param {String} startDate - Start date (YYYY-MM-DD)
   * @param {String} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} Booking statistics
   */
  getOwnerBookings: async (facilityId, startDate, endDate) => {
    try {
      if (!facilityId) {
        throw new Error('facilityId is required');
      }
      const params = { facilityId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/analytics/owner/bookings', { params });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get owner court statistics
   * GET /api/analytics/owner/courts?facilityId=xxx&startDate=xxx&endDate=xxx
   * @param {String} facilityId - Facility ID
   * @param {String} startDate - Start date (YYYY-MM-DD) - optional
   * @param {String} endDate - End date (YYYY-MM-DD) - optional
   * @returns {Promise} Court statistics
   */
  getOwnerCourts: async (facilityId, startDate, endDate) => {
    try {
      if (!facilityId) {
        throw new Error('facilityId is required');
      }
      const params = { facilityId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/analytics/owner/courts', {
        params,
      });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get owner peak hours statistics
   * GET /api/analytics/owner/peak-hours?facilityId=xxx&startDate=xxx&endDate=xxx
   * @param {String} facilityId - Facility ID
   * @param {String} startDate - Start date (YYYY-MM-DD)
   * @param {String} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} Peak hours statistics
   */
  getOwnerPeakHours: async (facilityId, startDate, endDate) => {
    try {
      if (!facilityId) {
        throw new Error('facilityId is required');
      }
      const params = { facilityId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/analytics/owner/peak-hours', { params });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get owner loyal customers statistics
   * GET /api/analytics/owner/loyal-customers?facilityId=xxx
   * @param {String} facilityId - Facility ID
   * @returns {Promise} Loyal customers statistics
   */
  getOwnerLoyalCustomers: async (facilityId) => {
    try {
      if (!facilityId) {
        throw new Error('facilityId is required');
      }
      const response = await api.get('/analytics/owner/loyal-customers', {
        params: { facilityId },
      });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get owner cancellation statistics
   * GET /api/analytics/owner/cancellations?facilityId=xxx&startDate=xxx&endDate=xxx
   * @param {String} facilityId - Facility ID
   * @param {String} startDate - Start date (YYYY-MM-DD)
   * @param {String} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} Cancellation statistics
   */
  getOwnerCancellations: async (facilityId, startDate, endDate) => {
    try {
      if (!facilityId) {
        throw new Error('facilityId is required');
      }
      const params = { facilityId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/analytics/owner/cancellations', { params });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default analyticsApi;

