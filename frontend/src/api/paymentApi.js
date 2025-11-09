import { api, handleApiError, handleApiSuccess } from './axiosClient';

export const paymentApi = {
  /**
   * Khởi tạo thanh toán (MoMo, VNPay)
   * @param {string} bookingId - ID của booking
   * @param {string} method - Phương thức thanh toán ('momo' hoặc 'vnpay')
   * @returns {Promise<{success: boolean, data: {paymentUrl: string}}>}
   */
  initPayment: async (bookingId, method) => {
    try {
      const response = await api.post('/payments/init', {
        bookingId,
        method
      });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Lấy trạng thái thanh toán
   * @param {string} paymentId - ID của payment
   * @returns {Promise<{success: boolean, data: {status: string}}>}
   */
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}/status`);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Lấy lịch sử thanh toán của user
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Số trang
   * @param {number} [params.limit] - Số lượng mỗi trang
   * @returns {Promise<{success: boolean, data: {payments: Array, pagination: Object}}>}
   */
  getPaymentHistory: async (params = {}) => {
    try {
      const response = await api.get('/payments/history', { params });
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

