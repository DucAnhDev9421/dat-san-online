import { api, handleApiError, handleApiSuccess, getAccessToken } from './axiosClient';

const getAPIBaseURL = () => import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * League API Service
 * Handles league/tournament operations
 */
export const leagueApi = {
  /**
   * Get all leagues of current user
   * GET /api/leagues
   * @returns {Promise} Leagues list
   */
  getLeagues: async () => {
    try {
      const response = await api.get('/leagues');
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get league by ID
   * GET /api/leagues/:id
   * @param {String} leagueId - League ID
   * @returns {Promise} League object
   */
  getLeagueById: async (leagueId) => {
    try {
      const response = await api.get(`/leagues/${leagueId}`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new league
   * POST /api/leagues
   * @param {Object} leagueData - League data object
   * @returns {Promise} League object
   */
  createLeague: async (leagueData) => {
    try {
      const response = await api.post('/leagues', leagueData);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update league
   * PUT /api/leagues/:id
   * @param {String} leagueId - League ID
   * @param {Object} leagueData - Updated league data
   * @returns {Promise} Updated league object
   */
  updateLeague: async (leagueId, leagueData) => {
    try {
      const response = await api.put(`/leagues/${leagueId}`, leagueData);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete league
   * DELETE /api/leagues/:id
   * @param {String} leagueId - League ID
   * @returns {Promise} Success message
   */
  deleteLeague: async (leagueId) => {
    try {
      const response = await api.delete(`/leagues/${leagueId}`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload image to league
   * POST /api/leagues/:id/upload
   * @param {String} leagueId - League ID
   * @param {File} image - Image file
   * @returns {Promise} League object with updated image URL
   */
  uploadImage: async (leagueId, image) => {
    try {
      if (!image) {
        throw new Error('Không có ảnh để upload');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('image', image);

      // Use fetch directly for multipart/form-data
      const token = getAccessToken();
      
      const response = await fetch(`${getAPIBaseURL()}/leagues/${leagueId}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser will add boundary automatically
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `Upload failed with status: ${response.status}` 
        }));
        throw new Error(errorData?.message || 'Upload ảnh thất bại');
      }

      const data = await response.json();
      
      if (data?.success) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Upload ảnh thành công',
        };
      } else {
        throw new Error(data?.message || 'Upload ảnh thất bại');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

