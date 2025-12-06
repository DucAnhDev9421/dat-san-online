import { generateChatResponse } from '../utils/geminiService.js';
import { buildContext, buildBookingContext, buildSuggestContext } from '../utils/contextBuilder.js';
import { getSystemPrompt } from '../utils/aiPrompts.js';
import SportCategory from '../models/SportCategory.js';
import CourtType from '../models/CourtType.js';

/**
 * POST /api/ai/chat
 * Chat with AI assistant
 */
export const chat = async (req, res, next) => {
  try {
    const { message, conversationHistory = [], userLocation } = req.body;
    const userId = req.user?._id?.toString() || null;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tin nhắn'
      });
    }

    // Build context based on user query
    const context = await buildContext({
      userQuery: message,
      userLocation: userLocation || null,
      userId: userId
    });

    // Get system prompt
    const systemPrompt = getSystemPrompt();

    // Format conversation history for Gemini
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content || msg.text || '' }]
    }));

    // Add current user message to history
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Generate response
    const response = await generateChatResponse(
      systemPrompt,
      formattedHistory.slice(0, -1), // Exclude current message from history
      context
    );

    if (!response.success) {
      return res.status(500).json({
        success: false,
        message: response.message || 'Có lỗi xảy ra khi xử lý yêu cầu'
      });
    }

    res.json({
      success: true,
      data: {
        message: response.message,
        facilities: context.facilities || [],
        courts: context.courts || [],
        context: {
          facilitiesCount: context.facilities?.length || 0,
          courtsCount: context.courts?.length || 0,
        },
        usage: response.usage
      }
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    next(error);
  }
};

/**
 * GET /api/ai/suggest-facilities
 * Get facility suggestions based on query
 */
export const suggestFacilities = async (req, res, next) => {
  try {
    const { query, lat, lng, maxDistance = 10000 } = req.query;
    const userId = req.user?._id?.toString() || null;

    const userLocation = (lat && lng) ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;

    const context = await buildContext({
      userQuery: query || '',
      userLocation: userLocation,
      userId: userId
    });

    res.json({
      success: true,
      data: {
        facilities: context.facilities || [],
        courts: context.courts || [],
        hasLocation: !!userLocation
      }
    });
  } catch (error) {
    console.error('Suggest Facilities Error:', error);
    next(error);
  }
};

/**
 * GET /api/ai/booking-data
 * Get sport categories and court types for booking flow
 */
export const getBookingData = async (req, res, next) => {
  try {
    const { sportCategoryId } = req.query;

    // Get sport categories
    const sportCategories = await SportCategory.find({ status: 'active' })
      .sort({ order: 1, name: 1 })
      .select('_id name')
      .lean();

    let courtTypes = [];
    if (sportCategoryId) {
      // Get court types for specific sport category
      courtTypes = await CourtType.find({
        sportCategory: sportCategoryId,
        status: 'active'
      })
        .populate('sportCategory', 'name')
        .sort({ order: 1, name: 1 })
        .select('_id name sportCategory')
        .lean();
    }

    res.json({
      success: true,
      data: {
        sportCategories: sportCategories.map(cat => ({
          id: cat._id.toString(),
          name: cat.name
        })),
        courtTypes: courtTypes.map(ct => ({
          id: ct._id.toString(),
          name: ct.name,
          sportCategory: ct.sportCategory?.name || ''
        }))
      }
    });
  } catch (error) {
    console.error('Get Booking Data Error:', error);
    next(error);
  }
};

/**
 * POST /api/ai/booking-search
 * Search facilities for booking with sport, court type, time slots
 */
export const searchBookingFacilities = async (req, res, next) => {
  try {
    const { sportCategoryId, courtTypeId, timeSlots, date, userLocation } = req.body;
    const userId = req.user?._id?.toString() || null;

    const context = await buildBookingContext({
      sportCategoryId,
      courtTypeId,
      timeSlots: timeSlots || [],
      date: date || new Date(),
      userLocation: userLocation || null,
      userId
    });

    res.json({
      success: true,
      data: {
        facilities: context.facilities || [],
        courts: context.courts || [],
        availableSlots: context.availableSlots || []
      }
    });
  } catch (error) {
    console.error('Search Booking Facilities Error:', error);
    next(error);
  }
};

/**
 * POST /api/ai/suggest-search
 * Search facilities with suggestions (price range, radius, time slots)
 */
export const searchSuggestFacilities = async (req, res, next) => {
  try {
    const { sportCategoryId, timeSlots, date, userLocation, priceMin, priceMax, radius } = req.body;
    const userId = req.user?._id?.toString() || null;

    const context = await buildSuggestContext({
      sportCategoryId,
      timeSlots: timeSlots || [],
      date: date || new Date(),
      userLocation: userLocation || null,
      userId,
      priceMin: priceMin || null,
      priceMax: priceMax || null,
      radius: radius || null
    });

    res.json({
      success: true,
      data: {
        facilities: context.facilities || [],
        courts: context.courts || []
      }
    });
  } catch (error) {
    console.error('Search Suggest Facilities Error:', error);
    next(error);
  }
};

