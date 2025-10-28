import { api, handleApiError, handleApiSuccess } from './axiosClient';

/**
 * User API Service
 * 
 * This file handles user-related API operations such as:
 * - Getting current user profile
 * - Updating user profile
 * - Managing avatar
 * - Updating language preference
 * - Changing password
 * - Admin operations on users
 */

export const userApi = {
  /**
   * Get current user profile
   * GET /api/users/profile
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/profile');
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update user profile
   * PUT /api/users/profile
   * @param {Object} userData - { name?, phone? }
   */
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload avatar
   * POST /api/users/avatar
   * @param {File} file - Avatar image file
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.upload('/users/avatar', formData);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete avatar
   * DELETE /api/users/avatar
   */
  deleteAvatar: async () => {
    try {
      const response = await api.delete('/users/avatar');
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update language preference
   * PATCH /api/users/language
   * @param {string} language - 'vi' or 'en'
   */
  updateLanguage: async (language) => {
    try {
      const response = await api.patch('/users/language', { language });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Change password
   * PUT /api/users/change-password
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // --- ADMIN ONLY OPERATIONS ---

  /**
   * Get all users (Admin only)
   * GET /api/users
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/users?page=${page}&limit=${limit}`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Change user role (Admin only)
   * PUT /api/users/role/:userId
   * @param {string} userId
   * @param {string} role - 'user', 'owner', or 'admin'
   */
  changeUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/users/role/${userId}`, { role });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default userApi;
