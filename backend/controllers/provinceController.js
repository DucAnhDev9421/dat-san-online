import asyncHandler from "express-async-handler";
import axios from "axios";
import https from "https";

const PROVINCES_API_BASE = "https://provinces.open-api.vn/api";
const FALLBACK_API_URL = "https://vapi.vnappmob.com/api/province";

// Create axios instance that ignores SSL certificate errors (for expired certificates)
// WARNING: Only use in development. In production, consider caching data or using a trusted API
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Bỏ qua lỗi certificate (tạm thời)
  }),
  timeout: 20000,
});

/**
 * Get provinces with districts (depth=2)
 * Proxy request to external API to avoid CORS issues
 * GET /api/provinces
 */
export const getProvinces = asyncHandler(async (req, res) => {
  const endpoints = [
    `${PROVINCES_API_BASE}/v1/?depth=2`, // v1: trước khi sát nhập (63 tỉnh thành) | v2: sau khi sát nhập (34 tỉnh thành)
    `${PROVINCES_API_BASE}/?depth=2`,
  ];

  // Try primary endpoints
  for (const endpoint of endpoints) {
    try {
      const response = await axiosInstance.get(endpoint, {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        const data = response.data;

        // Validate data format
        if (Array.isArray(data) && data.length > 0) {
          return res.json({
            success: true,
            data,
          });
        } else if (data && typeof data === "object") {
          if (
            data.results &&
            Array.isArray(data.results) &&
            data.results.length > 0
          ) {
            return res.json({
              success: true,
              data: data.results,
            });
          }
        }
      }
    } catch (error) {
      console.log(`Endpoint ${endpoint} failed:`, error.message);
      continue;
    }
  }

  // Try fallback APIs
  const fallbackEndpoints = [
    `${FALLBACK_API_URL}/`,
    `https://vapi.vnappmob.com/api/province/get_all`, // Alternative endpoint
    `https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json`, // GitHub raw file
  ];

  for (const fallbackEndpoint of fallbackEndpoints) {
    try {
      console.log(`Trying fallback API: ${fallbackEndpoint}`);
      const fallbackResponse = await axiosInstance.get(fallbackEndpoint, {
        headers: {
          Accept: "application/json",
        },
      });

      if (fallbackResponse.status === 200) {
        const fallbackData = fallbackResponse.data;

        // Handle different response formats
        let provincesData = null;

        // Format 1: vapi.vnappmob.com format
        if (
          fallbackData.results &&
          Array.isArray(fallbackData.results) &&
          fallbackData.results.length > 0
        ) {
          provincesData = fallbackData.results.map((province) => ({
            name: province.province_name,
            code: province.province_id,
            districts: province.districts || [],
          }));
        }
        // Format 2: GitHub raw JSON format or direct array
        else if (Array.isArray(fallbackData) && fallbackData.length > 0) {
          provincesData = fallbackData;
        }
        // Format 3: Object with data array
        else if (
          fallbackData.data &&
          Array.isArray(fallbackData.data) &&
          fallbackData.data.length > 0
        ) {
          provincesData = fallbackData.data;
        }

        if (provincesData && provincesData.length > 0) {
          return res.json({
            success: true,
            data: provincesData,
          });
        }
      }
    } catch (fallbackError) {
      console.log(
        `Fallback endpoint ${fallbackEndpoint} failed:`,
        fallbackError.message
      );
      continue; // Try next fallback
    }
  }

  // All APIs failed
  return res.status(500).json({
    success: false,
    data: [],
    error: "Không thể tải danh sách tỉnh thành. Vui lòng thử lại sau.",
  });
});

