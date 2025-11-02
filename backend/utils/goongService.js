// utils/goongService.js
import axios from 'axios';

const GOONG_API_KEY = process.env.GOONG_API_KEY;
const GOONG_GEOCODING_URL = 'https://rsapi.goong.io/Geocode';

/**
 * Chuyển đổi địa chỉ thành tọa độ sử dụng Goong Geocoding API
 * @param {string} address - Địa chỉ cần geocode
 * @returns {Promise<{lat: number, lng: number, formatted_address: string}>}
 */
export const geocodeAddress = async (address) => {
  if (!GOONG_API_KEY) {
    throw new Error('GOONG_API_KEY chưa được cấu hình');
  }

  try {
    const response = await axios.get(GOONG_GEOCODING_URL, {
      params: {
        address: address,
        api_key: GOONG_API_KEY
      }
    });

    if (response.data && response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const location = result.geometry?.location;
      
      if (location && location.lat && location.lng) {
        return {
          lat: location.lat,
          lng: location.lng,
          formatted_address: result.formatted_address || address,
          place_id: result.place_id
        };
      }
    }

    throw new Error('Không tìm thấy tọa độ cho địa chỉ này');
  } catch (error) {
    if (error.response) {
      // API trả về lỗi
      throw new Error(`Goong API Error: ${error.response.data?.error_message || error.message}`);
    } else if (error.request) {
      // Không nhận được response
      throw new Error('Không thể kết nối với Goong API');
    } else {
      // Lỗi khác
      throw error;
    }
  }
};

/**
 * Reverse geocode: Chuyển đổi tọa độ thành địa chỉ
 * @param {number} lat - Vĩ độ
 * @param {number} lng - Kinh độ
 * @returns {Promise<string>} Địa chỉ
 */
export const reverseGeocode = async (lat, lng) => {
  if (!GOONG_API_KEY) {
    throw new Error('GOONG_API_KEY chưa được cấu hình');
  }

  try {
    const response = await axios.get('https://rsapi.goong.io/Geocode', {
      params: {
        latlng: `${lat},${lng}`,
        api_key: GOONG_API_KEY
      }
    });

    if (response.data && response.data.results && response.data.results.length > 0) {
      return response.data.results[0].formatted_address || '';
    }

    throw new Error('Không tìm thấy địa chỉ cho tọa độ này');
  } catch (error) {
    if (error.response) {
      throw new Error(`Goong API Error: ${error.response.data?.error_message || error.message}`);
    }
    throw error;
  }
};

