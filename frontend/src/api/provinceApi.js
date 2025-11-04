/**
 * Province API Service
 * Handles fetching provinces and districts data from Vietnam administrative API
 */

const PROVINCES_API_BASE = 'https://provinces.open-api.vn/api';
const FALLBACK_API_URL = 'https://vapi.vnappmob.com/api/province';

/**
 * Fetch provinces with districts (depth=2)
 * @returns {Promise<Object>} Object with success flag and data array
 */
export const getProvinces = async () => {
  // Try multiple endpoints
  const endpoints = [
    `${PROVINCES_API_BASE}/v1/?depth=2`,  //  v1:trước khi sát nhập(63 tỉnh thành)| v2:sau khi sát nhập(34 tỉnh thành)
    `${PROVINCES_API_BASE}/?depth=2`,     
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      // Check if response is ok
      if (!response.ok) {
        continue; // Try next endpoint
      }

      const data = await response.json();

      // Validate data format
      if (Array.isArray(data) && data.length > 0) {
        return { success: true, data };
      } else if (data && typeof data === 'object') {
        // Some APIs return object with results array
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          return { success: true, data: data.results };
        }
      }
    } catch (error) {
      console.log(`Endpoint ${endpoint} failed:`, error.message);
      continue; // Try next endpoint
    }
  }

  // If all primary endpoints fail, try fallback
  try {
    console.log('Trying fallback API...');
    const fallbackResponse = await fetch(`${FALLBACK_API_URL}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      
      // Transform fallback data to match expected format
      if (fallbackData.results && Array.isArray(fallbackData.results)) {
        // Transform vapi format to open-api format
        const transformedData = fallbackData.results.map(province => ({
          name: province.province_name,
          code: province.province_id,
          districts: province.districts || [],
        }));
        
        return { success: true, data: transformedData };
      }
    }
  } catch (fallbackError) {
    console.error('Error fetching provinces from fallback API:', fallbackError);
  }

  // All APIs failed
  return { 
    success: false, 
    data: [],
    error: 'Không thể tải danh sách tỉnh thành. Vui lòng thử lại sau.'
  };
};

/**
 * Get districts for a specific province
 * @param {string} provinceName - Name of the province
 * @param {Array} provinces - Array of all provinces
 * @returns {Array} Array of districts
 */
export const getDistrictsByProvince = (provinceName, provinces) => {
  if (!provinceName || !provinces || provinces.length === 0) {
    return [];
  }

  const province = provinces.find(p => p.name === provinceName || p.name_en === provinceName);
  return province?.districts || [];
};

/**
 * Get wards for a specific district
 * @param {string} districtName - Name of the district
 * @param {Array} districts - Array of all districts
 * @returns {Array} Array of wards
 */
export const getWardsByDistrict = (districtName, districts) => {
  if (!districtName || !districts || districts.length === 0) {
    return [];
  }

  const district = districts.find(d => d.name === districtName || d.name_en === districtName);
  return district?.wards || [];
};

export default {
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
};

