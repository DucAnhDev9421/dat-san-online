import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useMobile from '../../hook/use-mobile';
import useToggle from '../../hook/use-toggle';
import { useAuth } from '../../contexts/AuthContext';
import useUserLocation from '../../hook/use-user-location';
import { aiApi } from '../../api/aiApi';
import FacilityCard from './FacilityCard';
import CourtCard from './CourtCard';
import chatbotAvatar from '../../assets/chatbot.png';
import './ChatButton.css';

// Quick Replies - Common questions
const QUICK_REPLIES = [
  { text: 'Tìm cơ sở gần nhất', message: 'Tìm các cơ sở gần tôi' },
  { text: 'Đặt sân', message: 'Hướng dẫn tôi cách đặt sân' },
  { text: 'Gợi ý sân phù hợp', message: 'Gợi ý sân phù hợp' },
];

const ChatButton = () => {
  const location = useLocation();
  const isMobile = useMobile(768);
  const [isOpen, { toggle: toggleChat }] = useToggle(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { userLocation } = useUserLocation();
  
  // Booking flow state
  const [bookingStep, setBookingStep] = useState(null); // 'sport' | 'courtType' | 'date' | 'timeSlots' | 'search' | 'suggest' | 'priceRange' | 'radius'
  const [flowType, setFlowType] = useState(null); // 'booking' | 'suggest'
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedCourtType, setSelectedCourtType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState(null);
  const [dynamicQuickReplies, setDynamicQuickReplies] = useState([]);
  const [sportCategories, setSportCategories] = useState([]);
  const [courtTypes, setCourtTypes] = useState([]);
  
  // Hide chat button on auth pages, admin pages, owner pages, and chat page
  const authPages = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password', '/auth/callback', '/auth/error'];
  const isAuthPage = authPages.some(path => location.pathname.startsWith(path));
  const isAdminPage = location.pathname.startsWith('/admin');
  const isOwnerPage = location.pathname.startsWith('/owner');
  const isChatPage = location.pathname.startsWith('/chat');

  // Initialize with welcome message and reset booking flow
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        role: 'bot',
        content: 'Xin chào! 👋 Tôi là AI Assistant. Tôi có thể giúp bạn:\n\n• Tìm các cơ sở gần nhất 📍\n• Gợi ý sân giá rẻ 💰\n• Hỗ trợ đặt sân ⚽\n\nBạn cần hỗ trợ gì hôm nay?',
        timestamp: new Date()
      }]);
      // Reset booking flow
      setBookingStep(null);
      setFlowType(null);
      setSelectedSport(null);
      setSelectedCourtType(null);
      setSelectedDate(null);
      setSelectedTimeSlots([]);
      setSelectedPriceRange(null);
      setSelectedRadius(null);
      setDynamicQuickReplies([]);
    }
  }, [isOpen]);

  // Scroll to bottom when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Build conversation history
      const conversationHistory = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content
        }));

      // Get user location if available
      const location = userLocation ? {
        lat: userLocation.latitude,
        lng: userLocation.longitude
      } : null;

      // Call AI API
      const response = await aiApi.chat(
        userMessage.content,
        conversationHistory,
        location
      );

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          role: 'bot',
          content: response.data.message,
          facilities: response.data.facilities || [],
          courts: response.data.courts || [],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: 'Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau. 😔',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendMessage(inputMessage);
  };

  const handleQuickReply = async (message, data = null) => {
    // Check flow type
    if (message === 'Hướng dẫn tôi cách đặt sân' || (bookingStep && flowType === 'booking')) {
      await handleBookingFlow(message, data);
    } else if (message === 'Gợi ý sân phù hợp' || (bookingStep && flowType === 'suggest')) {
      await handleSuggestFlow(message, data);
    } else {
      sendMessage(message);
    }
  };

  const handleBookingFlow = async (message, data = null) => {
    if (!bookingStep) {
      // Start booking flow
      setFlowType('booking');
      setBookingStep('sport');
      
      // Load sport categories
      try {
        const response = await aiApi.getBookingData();
        if (response.success) {
          setSportCategories(response.data.sportCategories || []);
          const quickReplies = (response.data.sportCategories || []).map(cat => ({
            text: cat.name,
            message: `Chọn ${cat.name}`,
            data: { type: 'sport', id: cat.id, name: cat.name }
          }));
          setDynamicQuickReplies(quickReplies);
          
          // Add bot message
          const botMessage = {
            id: Date.now(),
            role: 'bot',
            content: 'Bạn muốn đặt sân cho môn thể thao nào? 🏃',
            timestamp: new Date(),
            quickReplies: quickReplies
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } catch (error) {
        console.error('Error loading sport categories:', error);
      }
      return;
    }

    // Handle booking step
    if (bookingStep === 'sport' && data && data.type === 'sport') {
      setSelectedSport(data);
      setBookingStep('courtType');
      
      // Load court types for selected sport
      try {
        const response = await aiApi.getBookingData(data.id);
        if (response.success) {
          setCourtTypes(response.data.courtTypes || []);
          const quickReplies = (response.data.courtTypes || []).map(ct => ({
            text: ct.name,
            message: `Chọn ${ct.name}`,
            data: { type: 'courtType', id: ct.id, name: ct.name }
          }));
          setDynamicQuickReplies(quickReplies);
          
          // Add user and bot messages
          const userMsg = {
            id: Date.now(),
            role: 'user',
            content: data.name,
            timestamp: new Date()
          };
          const botMsg = {
            id: Date.now() + 1,
            role: 'bot',
            content: `Bạn đã chọn ${data.name}. Vui lòng chọn loại sân:`,
            timestamp: new Date(),
            quickReplies: quickReplies
          };
          setMessages(prev => [...prev, userMsg, botMsg]);
        }
      } catch (error) {
        console.error('Error loading court types:', error);
      }
      return;
    }

    if (bookingStep === 'courtType' && data && data.type === 'courtType') {
      setSelectedCourtType(data);
      setBookingStep('date');
      
      // Generate date options (today, tomorrow, and next 6 days)
      const dateOptions = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayName = dayNames[date.getDay()];
        const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        
        let label = '';
        if (i === 0) {
          label = `Hôm nay (${dateStr})`;
        } else if (i === 1) {
          label = `Ngày mai (${dateStr})`;
        } else {
          label = `${dayName} (${dateStr})`;
        }
        
        dateOptions.push({
          text: label,
          message: label,
          data: { 
            type: 'date', 
            date: date.toISOString().split('T')[0],
            dateObj: date
          }
        });
      }
      
      setDynamicQuickReplies(dateOptions);
      
      // Add user and bot messages
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: data.name,
        timestamp: new Date()
      };
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: `Bạn đã chọn ${data.name}. Vui lòng chọn ngày muốn đặt sân:`,
        timestamp: new Date(),
        quickReplies: dateOptions
      };
      setMessages(prev => [...prev, userMsg, botMsg]);
      return;
    }

    if (bookingStep === 'date' && data && data.type === 'date') {
      setSelectedDate(data.dateObj);
      setBookingStep('timeSlots');
      
      // Generate time slot options
      const timeSlots = [];
      for (let hour = 6; hour <= 22; hour++) {
        const startTime = `${String(hour).padStart(2, '0')}:00`;
        const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
        timeSlots.push({
          text: `${startTime}-${endTime}`,
          message: startTime,
          data: { type: 'timeSlot', slot: `${startTime}-${endTime}` }
        });
      }
      setDynamicQuickReplies(timeSlots);
      
      // Format date for display
      const dateDisplay = data.dateObj.toLocaleDateString('vi-VN', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'numeric' 
      });
      
      // Add user and bot messages
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: data.dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        timestamp: new Date()
      };
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: `Bạn đã chọn ${dateDisplay}. Vui lòng chọn khung giờ muốn chơi (có thể chọn nhiều):`,
        timestamp: new Date(),
        quickReplies: timeSlots,
        allowMultiple: true
      };
      setMessages(prev => [...prev, userMsg, botMsg]);
      return;
    }

    if (bookingStep === 'timeSlots' && data && data.type === 'timeSlot') {
      // Toggle time slot selection (no message, just visual feedback)
      setSelectedTimeSlots(prev => {
        const exists = prev.includes(data.slot);
        const newSlots = exists
          ? prev.filter(s => s !== data.slot)
          : [...prev, data.slot];
        
        // Update quick replies to show search button if slots selected
        if (newSlots.length > 0) {
          const timeSlots = [];
          for (let hour = 6; hour <= 22; hour++) {
            const startTime = `${String(hour).padStart(2, '0')}:00`;
            const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
            timeSlots.push({
              text: `${startTime}-${endTime}`,
              message: startTime,
              data: { type: 'timeSlot', slot: `${startTime}-${endTime}` }
            });
          }
          timeSlots.push({ text: 'Tìm sân', message: 'Tìm sân', data: { type: 'search' } });
          setDynamicQuickReplies(timeSlots);
        } else {
          // Remove search button if no slots selected
          const timeSlots = [];
          for (let hour = 6; hour <= 22; hour++) {
            const startTime = `${String(hour).padStart(2, '0')}:00`;
            const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
            timeSlots.push({
              text: `${startTime}-${endTime}`,
              message: startTime,
              data: { type: 'timeSlot', slot: `${startTime}-${endTime}` }
            });
          }
          setDynamicQuickReplies(timeSlots);
        }
        
        return newSlots;
      });
      
      // Don't add user message - just visual feedback via selected state
      return;
    }

    if (bookingStep === 'timeSlots' && data && data.type === 'search') {
      // Validate that time slots are selected
      if (selectedTimeSlots.length === 0) {
        const errorMsg = {
          id: Date.now(),
          role: 'bot',
          content: 'Vui lòng chọn ít nhất một khung giờ trước khi tìm sân.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      // Search facilities
      setBookingStep('search');
      setIsTyping(true);
      setIsLoading(true);
      
      // Add user message showing selected time slots
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: `Tìm sân cho các khung giờ: ${selectedTimeSlots.join(', ')}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      
      try {
        const location = userLocation ? {
          lat: userLocation.latitude,
          lng: userLocation.longitude
        } : null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bookingDate = selectedDate || today;
        bookingDate.setHours(0, 0, 0, 0);

        const response = await aiApi.searchBookingFacilities({
          sportCategoryId: selectedSport?.id,
          courtTypeId: selectedCourtType?.id,
          timeSlots: selectedTimeSlots,
          date: bookingDate.toISOString(),
          userLocation: location
        });

        if (response.success) {
          
          const facilities = response.data.facilities || [];
          const botMsg = {
            id: Date.now() + 1,
            role: 'bot',
            content: facilities.length > 0 
              ? `Tôi tìm thấy ${facilities.length} cơ sở phù hợp với yêu cầu của bạn:`
              : 'Không tìm thấy cơ sở nào phù hợp. Vui lòng thử lại với khung giờ khác.',
            facilities: facilities,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, userMsg, botMsg]);
          setBookingStep(null);
          setFlowType(null);
          setSelectedSport(null);
          setSelectedCourtType(null);
          setSelectedDate(null);
          setSelectedTimeSlots([]);
          setSelectedPriceRange(null);
          setSelectedRadius(null);
          setDynamicQuickReplies([]);
        }
      } catch (error) {
        console.error('Error searching facilities:', error);
        const errorMsg = {
          id: Date.now() + 1,
          role: 'bot',
          content: 'Xin lỗi, có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
        setIsLoading(false);
      }
    }
  };

  // Handle suggest flow - Gợi ý sân phù hợp
  const handleSuggestFlow = async (message, data = null) => {
    if (!bookingStep) {
      // Start suggest flow
      setFlowType('suggest');
      setBookingStep('sport');
      
      // Load sport categories
      try {
        const response = await aiApi.getBookingData();
        if (response.success) {
          setSportCategories(response.data.sportCategories || []);
          const quickReplies = (response.data.sportCategories || []).map(cat => ({
            text: cat.name,
            message: `Chọn ${cat.name}`,
            data: { type: 'sport', id: cat.id, name: cat.name }
          }));
          setDynamicQuickReplies(quickReplies);
          
          // Add bot message
          const botMessage = {
            id: Date.now(),
            role: 'bot',
            content: 'Bạn muốn tìm sân cho môn thể thao nào?',
            timestamp: new Date(),
            quickReplies: quickReplies
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } catch (error) {
        console.error('Error loading sport categories:', error);
      }
      return;
    }

    // Handle sport selection
    if (bookingStep === 'sport' && data && data.type === 'sport') {
      setSelectedSport(data);
      setBookingStep('priceRange');
      
      // Price range options
      const priceRanges = [
        { text: 'Dưới 100k/giờ', min: 0, max: 100000 },
        { text: '100k - 200k/giờ', min: 100000, max: 200000 },
        { text: '200k - 300k/giờ', min: 200000, max: 300000 },
        { text: '300k - 500k/giờ', min: 300000, max: 500000 },
        { text: 'Trên 500k/giờ', min: 500000, max: null },
        { text: 'Không quan tâm', min: null, max: null }
      ];
      
      const quickReplies = priceRanges.map(pr => ({
        text: pr.text,
        message: pr.text,
        data: { type: 'priceRange', min: pr.min, max: pr.max, text: pr.text }
      }));
      setDynamicQuickReplies(quickReplies);
      
      // Add user and bot messages
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: data.name,
        timestamp: new Date()
      };
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: `Bạn đã chọn ${data.name}. Vui lòng chọn khoảng giá phù hợp:`,
        timestamp: new Date(),
        quickReplies: quickReplies
      };
      setMessages(prev => [...prev, userMsg, botMsg]);
      return;
    }

    // Handle price range selection
    if (bookingStep === 'priceRange' && data && data.type === 'priceRange') {
      setSelectedPriceRange(data);
      setBookingStep('radius');
      
      // Radius options (in km)
      const radiusOptions = [
        { text: '1 km', value: 1 },
        { text: '3 km', value: 3 },
        { text: '5 km', value: 5 },
        { text: '10 km', value: 10 },
        { text: '15 km', value: 15 },
        { text: 'Không giới hạn', value: null }
      ];
      
      const quickReplies = radiusOptions.map(r => ({
        text: r.text,
        message: r.text,
        data: { type: 'radius', value: r.value, text: r.text }
      }));
      setDynamicQuickReplies(quickReplies);
      
      // Add user and bot messages
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: data.text,
        timestamp: new Date()
      };
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: `Bạn đã chọn ${data.text}. Vui lòng chọn bán kính tìm kiếm:`,
        timestamp: new Date(),
        quickReplies: quickReplies
      };
      setMessages(prev => [...prev, userMsg, botMsg]);
      return;
    }

    // Handle radius selection
    if (bookingStep === 'radius' && data && data.type === 'radius') {
      setSelectedRadius(data);
      setBookingStep('timeSlots');
      
      // Generate time slot options
      const timeSlots = [];
      for (let hour = 6; hour <= 22; hour++) {
        const startTime = `${String(hour).padStart(2, '0')}:00`;
        const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
        timeSlots.push({
          text: `${startTime}-${endTime}`,
          message: startTime,
          data: { type: 'timeSlot', slot: `${startTime}-${endTime}` }
        });
      }
      setDynamicQuickReplies(timeSlots);
      
      // Add user and bot messages
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: data.text,
        timestamp: new Date()
      };
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: `Bạn đã chọn ${data.text}. Vui lòng chọn giờ trống muốn tìm (có thể chọn nhiều):`,
        timestamp: new Date(),
        quickReplies: timeSlots,
        allowMultiple: true
      };
      setMessages(prev => [...prev, userMsg, botMsg]);
      return;
    }

    // Handle time slots selection (same as booking flow)
    if (bookingStep === 'timeSlots' && data && data.type === 'timeSlot') {
      // Toggle time slot selection (no message, just visual feedback)
      setSelectedTimeSlots(prev => {
        const exists = prev.includes(data.slot);
        const newSlots = exists
          ? prev.filter(s => s !== data.slot)
          : [...prev, data.slot];
        
        // Update quick replies to show search button if slots selected
        if (newSlots.length > 0) {
          const timeSlots = [];
          for (let hour = 6; hour <= 22; hour++) {
            const startTime = `${String(hour).padStart(2, '0')}:00`;
            const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
            timeSlots.push({
              text: `${startTime}-${endTime}`,
              message: startTime,
              data: { type: 'timeSlot', slot: `${startTime}-${endTime}` }
            });
          }
          timeSlots.push({ text: 'Tìm sân', message: 'Tìm sân', data: { type: 'search' } });
          setDynamicQuickReplies(timeSlots);
        } else {
          // Remove search button if no slots selected
          const timeSlots = [];
          for (let hour = 6; hour <= 22; hour++) {
            const startTime = `${String(hour).padStart(2, '0')}:00`;
            const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
            timeSlots.push({
              text: `${startTime}-${endTime}`,
              message: startTime,
              data: { type: 'timeSlot', slot: `${startTime}-${endTime}` }
            });
          }
          setDynamicQuickReplies(timeSlots);
        }
        
        return newSlots;
      });
      
      // Don't add user message - just visual feedback via selected state
      return;
    }

    // Handle search
    if (bookingStep === 'timeSlots' && data && data.type === 'search') {
      // Validate that time slots are selected
      if (selectedTimeSlots.length === 0) {
        const errorMsg = {
          id: Date.now(),
          role: 'bot',
          content: 'Vui lòng chọn ít nhất một khung giờ trước khi tìm sân.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      // Search facilities
      setBookingStep('search');
      setIsTyping(true);
      setIsLoading(true);
      
      // Add user message showing selected criteria
      const criteria = [];
      if (selectedSport) criteria.push(`Môn: ${selectedSport.name}`);
      if (selectedPriceRange) criteria.push(`Giá: ${selectedPriceRange.text}`);
      if (selectedRadius) criteria.push(`Bán kính: ${selectedRadius.text}`);
      if (selectedTimeSlots.length > 0) criteria.push(`Giờ: ${selectedTimeSlots.join(', ')}`);
      
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: `Tìm sân với: ${criteria.join(', ')}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      
      try {
        const location = userLocation ? {
          lat: userLocation.latitude,
          lng: userLocation.longitude
        } : null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const response = await aiApi.searchSuggestFacilities({
          sportCategoryId: selectedSport?.id,
          timeSlots: selectedTimeSlots,
          date: today.toISOString(),
          userLocation: location,
          priceMin: selectedPriceRange?.min,
          priceMax: selectedPriceRange?.max,
          radius: selectedRadius?.value ? selectedRadius.value * 1000 : null // Convert km to meters
        });

        if (response.success) {
          const facilities = response.data.facilities || [];
          const botMsg = {
            id: Date.now() + 1,
            role: 'bot',
            content: facilities.length > 0 
              ? `Tôi tìm thấy ${facilities.length} cơ sở phù hợp với yêu cầu của bạn:`
              : 'Không tìm thấy cơ sở nào phù hợp. Vui lòng thử lại với tiêu chí khác.',
            facilities: facilities,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botMsg]);
          setBookingStep(null);
          setFlowType(null);
          setSelectedSport(null);
          setSelectedPriceRange(null);
          setSelectedRadius(null);
          setSelectedTimeSlots([]);
          setDynamicQuickReplies([]);
        }
      } catch (error) {
        console.error('Error searching facilities:', error);
        const errorMsg = {
          id: Date.now() + 1,
          role: 'bot',
          content: 'Xin lỗi, có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
        setIsLoading(false);
      }
    }
  };

  // Check if should show quick replies
  const shouldShowQuickReplies = () => {
    if (messages.length === 0) return false;
    if (isTyping || isLoading) return false;
    
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'bot') return false;
    
    // Show dynamic quick replies if in booking/suggest flow
    if (dynamicQuickReplies.length > 0 && bookingStep) {
      return true;
    }
    
    // Show static quick replies if not in any flow (user hasn't selected a Quick Reply yet)
    if (!bookingStep) {
      return true;
    }
    
    return false;
  };

  // Get quick replies to show
  const getQuickReplies = () => {
    if (dynamicQuickReplies.length > 0) {
      return dynamicQuickReplies;
    }
    return QUICK_REPLIES;
  };

  // Don't render chat button on auth pages, admin pages, owner pages, or chat page
  if (isAuthPage || isAdminPage || isOwnerPage || isChatPage) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      <button 
        className={`chat-button ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        title="Chat với AI Assistant"
      >
        <svg 
          className="chat-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" 
            fill="currentColor"
          />
          <path 
            d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" 
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="chat-window"
          style={isMobile ? {
            width: 'calc(100vw - 40px)',
            height: 'calc(100vh - 120px)',
            bottom: '80px',
            right: '20px',
            left: '20px'
          } : undefined}
        >
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <img src={chatbotAvatar} alt="Chatbot Avatar" />
              </div>
              <div className="chat-header-text">
                <h4>AI Assistant</h4>
                <span className="status">Đang hoạt động</span>
              </div>
            </div>
            <button className="close-button" onClick={toggleChat}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <div className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
                  {message.role === 'bot' && (
                    <div className="message-avatar">
                      <img src={chatbotAvatar} alt="Chatbot Avatar" />
                    </div>
                  )}
                  <div className="message-content">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
                {/* Display facilities list */}
                {message.role === 'bot' && message.facilities && message.facilities.length > 0 && (
                  <div className="chat-results-container">
                    <div className="chat-results-title">Cơ sở tìm thấy:</div>
                    <div className="chat-facilities-list">
                      {message.facilities.map((facility) => (
                        <FacilityCard 
                          key={facility.id} 
                          facility={facility}
                          userLocation={userLocation}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {/* Display courts list */}
                {message.role === 'bot' && message.courts && message.courts.length > 0 && (
                  <div className="chat-results-container">
                    <div className="chat-results-title">Sân tìm thấy:</div>
                    <div className="chat-facilities-list">
                      {message.courts.map((court) => (
                        <CourtCard 
                          key={court.id} 
                          court={court}
                          userLocation={userLocation}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
            
            {isTyping && (
              <div className="message bot-message typing-message">
                <div className="message-avatar">
                  <img src={chatbotAvatar} alt="Chatbot Avatar" />
                </div>
                <div className="message-content typing-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Replies */}
            {shouldShowQuickReplies() && (
              <div className="chat-quick-replies">
                {getQuickReplies().map((reply, index) => {
                  const isSelected = reply.data?.type === 'timeSlot' && selectedTimeSlots.includes(reply.data.slot);
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`quick-reply-button ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleQuickReply(reply.message, reply.data)}
                      disabled={isLoading}
                    >
                      {reply.text}
                    </button>
                  );
                })}
                {bookingStep === 'timeSlots' && selectedTimeSlots.length > 0 && (
                  <div className="selected-time-slots">
                    <span>Đã chọn: {selectedTimeSlots.join(', ')}</span>
                  </div>
                )}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chat-input" onSubmit={handleSendMessage}>
            <div className="input-container">
              <input 
                type="text" 
                placeholder="Nhập tin nhắn của bạn..." 
                className="message-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit"
                className="send-button"
                disabled={!inputMessage.trim() || isLoading}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatButton;
