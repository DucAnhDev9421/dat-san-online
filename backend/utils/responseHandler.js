/**
 * Response Handler - Quản lý các câu trả lời có sẵn cho chatbot
 * Chỉ sử dụng dữ liệu từ database, không tự tạo nội dung
 */

import { isAvailabilityQuery } from './timeParser.js';

/**
 * Phân tích intent từ tin nhắn người dùng
 */
export const analyzeIntent = (message) => {
  const msg = message.toLowerCase().trim();
  
  // Kiểm tra sân trống (ưu tiên cao)
  if (isAvailabilityQuery(msg)) {
    return 'check_availability';
  }
  
  // Tìm cơ sở gần nhất
  if (msg.match(/(gần|gần nhất|gần đây|gần tôi|quanh đây|quanh tôi)/)) {
    return 'find_nearby';
  }
  
  // Tìm sân giá rẻ
  if (msg.match(/(giá rẻ|rẻ|giá thấp|rẻ nhất|giá tốt|giá hợp lý)/)) {
    return 'find_cheap';
  }
  
  // Đặt sân
  if (msg.match(/(đặt sân|đặt|book|booking|muốn đặt|tôi muốn đặt)/)) {
    return 'booking';
  }
  
  // Gợi ý sân
  if (msg.match(/(gợi ý|gợi ý sân|tư vấn|tìm sân|tìm kiếm)/)) {
    return 'suggest';
  }
  
  // Tìm theo loại thể thao
  if (msg.match(/(bóng đá|tennis|cầu lông|bóng rổ|bóng chuyền|bóng bàn|bóng chày|golf)/)) {
    return 'find_by_sport';
  }
  
  // Hỏi về giá
  if (msg.match(/(giá|giá cả|bao nhiêu|chi phí|phí)/)) {
    return 'ask_price';
  }
  
  // Hỏi về địa chỉ
  if (msg.match(/(địa chỉ|ở đâu|địa điểm|vị trí)/)) {
    return 'ask_location';
  }
  
  // Hỏi về giờ mở cửa
  if (msg.match(/(giờ|mở cửa|đóng cửa|thời gian|hoạt động)/)) {
    return 'ask_hours';
  }
  
  // Hỏi về đặt sân
  if (msg.match(/(cách đặt|hướng dẫn đặt|quy trình|làm sao để đặt)/)) {
    return 'ask_booking_guide';
  }
  
  // Chào hỏi
  if (msg.match(/(chào|xin chào|hello|hi|hey)/)) {
    return 'greeting';
  }
  
  // Cảm ơn
  if (msg.match(/(cảm ơn|thanks|thank you|cám ơn)/)) {
    return 'thanks';
  }
  
  // Tạm biệt
  if (msg.match(/(tạm biệt|bye|goodbye|hẹn gặp lại)/)) {
    return 'goodbye';
  }
  
  // Tìm kiếm chung
  if (msg.length > 2) {
    return 'search';
  }
  
  return 'unknown';
};

/**
 * Tạo câu trả lời dựa trên intent và context
 */
export const generateResponse = (intent, context = {}) => {
  const { facilities = [], courts = [], userBookings = [] } = context;
  
  switch (intent) {
    case 'greeting':
      return {
        message: 'Chào bạn! Tôi có thể giúp bạn tìm kiếm sân, kiểm tra lịch trống hoặc đặt sân. Bạn cần hỗ trợ gì?',
        facilities: [],
        courts: []
      };
    
    case 'find_nearby':
      // Nếu chưa có sportCategoryId, trả về câu hỏi về môn thể thao
      if (!context.sportCategoryId) {
        return {
          message: 'Bạn muốn tìm cơ sở cho môn thể thao nào?',
          facilities: [],
          courts: [],
          needsSportSelection: true
        };
      }
      
      if (!context.userLocation) {
        return {
          message: 'Để tìm cơ sở gần nhất, vui lòng cung cấp vị trí của bạn.',
          facilities: [],
          courts: []
        };
      }
      
      if (facilities.length === 0) {
        return {
          message: 'Không tìm thấy cơ sở nào gần vị trí của bạn cho môn thể thao này. Vui lòng thử tìm kiếm với môn thể thao khác.',
          facilities: [],
          courts: []
        };
      }
      
      const facilityList = facilities.slice(0, 5).map(f => 
        `${f.name} - ${f.address}${f.pricePerHour ? ` (Giá: ${f.pricePerHour.toLocaleString('vi-VN')}đ/giờ)` : ''}`
      ).join('\n');
      
      return {
        message: `Tìm thấy ${facilities.length} cơ sở gần bạn:\n\n${facilityList}\n\nBạn có thể xem chi tiết và đặt sân tại các cơ sở này.`,
        facilities: facilities.slice(0, 5),
        courts: []
      };
    
    case 'find_cheap':
      if (courts.length === 0) {
        return {
          message: 'Không tìm thấy sân nào phù hợp. Vui lòng thử lại sau.',
          facilities: [],
          courts: []
        };
      }
      
      const cheapList = courts.slice(0, 5).map(c => 
        `${c.name} - ${c.facility?.name || ''} (Giá: ${c.price.toLocaleString('vi-VN')}đ/giờ)`
      ).join('\n');
      
      return {
        message: `Tìm thấy ${courts.length} sân có giá tốt:\n\n${cheapList}\n\nBạn có thể xem chi tiết và đặt sân.`,
        facilities: [],
        courts: courts.slice(0, 5)
      };
    
    case 'booking':
      return {
        message: 'Để đặt sân, vui lòng chọn loại thể thao, loại sân, ngày và giờ bạn muốn. Tôi sẽ tìm các sân còn trống cho bạn.',
        facilities: [],
        courts: []
      };
    
    case 'suggest':
      if (facilities.length === 0 && courts.length === 0) {
        return {
          message: 'Vui lòng cung cấp thêm thông tin như loại thể thao, vị trí hoặc khoảng giá để tôi có thể gợi ý sân phù hợp.',
          facilities: [],
          courts: []
        };
      }
      
      const suggestList = facilities.length > 0 
        ? facilities.slice(0, 5).map(f => 
            `${f.name} - ${f.address}${f.pricePerHour ? ` (Giá: ${f.pricePerHour.toLocaleString('vi-VN')}đ/giờ)` : ''}`
          ).join('\n')
        : courts.slice(0, 5).map(c => 
            `${c.name} - ${c.facility?.name || ''} (Giá: ${c.price.toLocaleString('vi-VN')}đ/giờ)`
          ).join('\n');
      
      return {
        message: `Gợi ý cho bạn:\n\n${suggestList}\n\nBạn có thể xem chi tiết và đặt sân.`,
        facilities: facilities.slice(0, 5),
        courts: courts.slice(0, 5)
      };
    
    case 'find_by_sport':
      if (facilities.length === 0) {
        return {
          message: 'Không tìm thấy cơ sở nào cho loại thể thao này. Vui lòng thử tìm kiếm với từ khóa khác.',
          facilities: [],
          courts: []
        };
      }
      
      const sportList = facilities.slice(0, 5).map(f => 
        `${f.name} - ${f.address}${f.types ? ` (${f.types.join(', ')})` : ''}`
      ).join('\n');
      
      return {
        message: `Tìm thấy ${facilities.length} cơ sở:\n\n${sportList}\n\nBạn có thể xem chi tiết và đặt sân.`,
        facilities: facilities.slice(0, 5),
        courts: []
      };
    
    case 'ask_price':
      if (facilities.length > 0) {
        const priceInfo = facilities.slice(0, 3).map(f => 
          `${f.name}: ${f.pricePerHour ? f.pricePerHour.toLocaleString('vi-VN') + 'đ/giờ' : 'Liên hệ để biết giá'}`
        ).join('\n');
        return {
          message: `Giá tham khảo:\n\n${priceInfo}\n\nGiá có thể thay đổi tùy theo loại sân và khung giờ.`,
          facilities: facilities.slice(0, 3),
          courts: []
        };
      }
      return {
        message: 'Vui lòng chọn cơ sở hoặc sân cụ thể để xem giá chi tiết.',
        facilities: [],
        courts: []
      };
    
    case 'ask_location':
      if (facilities.length > 0) {
        const locationInfo = facilities.slice(0, 5).map(f => 
          `${f.name}: ${f.address}`
        ).join('\n');
        return {
          message: `Địa chỉ các cơ sở:\n\n${locationInfo}`,
          facilities: facilities.slice(0, 5),
          courts: []
        };
      }
      return {
        message: 'Vui lòng chọn cơ sở cụ thể để xem địa chỉ.',
        facilities: [],
        courts: []
      };
    
    case 'ask_hours':
      return {
        message: 'Thời gian hoạt động của các cơ sở có thể khác nhau. Vui lòng xem chi tiết tại trang thông tin cơ sở hoặc liên hệ trực tiếp.',
        facilities: [],
        courts: []
      };
    
    case 'ask_booking_guide':
      return {
        message: 'Quy trình đặt sân:\n1. Chọn loại thể thao và loại sân\n2. Chọn ngày và giờ\n3. Chọn sân phù hợp\n4. Xác nhận và thanh toán\n\nBạn có muốn bắt đầu đặt sân không?',
        facilities: [],
        courts: []
      };
    
    case 'thanks':
      return {
        message: 'Không có gì. Nếu cần hỗ trợ thêm, vui lòng cho tôi biết.',
        facilities: [],
        courts: []
      };
    
    case 'goodbye':
      return {
        message: 'Tạm biệt. Chúc bạn có trải nghiệm tốt!',
        facilities: [],
        courts: []
      };
    
    case 'search':
      if (facilities.length > 0 || courts.length > 0) {
        const results = facilities.length > 0
          ? facilities.slice(0, 5).map(f => 
              `${f.name} - ${f.address}`
            ).join('\n')
          : courts.slice(0, 5).map(c => 
              `${c.name} - ${c.facility?.name || ''}`
            ).join('\n');
        
        return {
          message: `Kết quả tìm kiếm:\n\n${results}\n\nBạn có thể xem chi tiết và đặt sân.`,
          facilities: facilities.slice(0, 5),
          courts: courts.slice(0, 5)
        };
      }
      return {
        message: 'Không tìm thấy kết quả phù hợp. Vui lòng thử lại với từ khóa khác hoặc cung cấp thêm thông tin.',
        facilities: [],
        courts: []
      };
    
    case 'check_availability':
      // Nếu đã có thông tin về sân trống từ availability service, sẽ được xử lý trong controller
      // Đây là fallback nếu availability service không được gọi
      if (facilities.length > 0 || courts.length > 0) {
        const availableList = facilities.length > 0
          ? facilities.slice(0, 5).map(f => 
              `${f.name} - ${f.address}`
            ).join('\n')
          : courts.slice(0, 5).map(c => 
              `${c.name} - ${c.facility?.name || ''}`
            ).join('\n');
        
        return {
          message: `Tìm thấy các cơ sở/sân:\n\n${availableList}\n\nĐể kiểm tra sân trống cụ thể, vui lòng cung cấp thời gian (ví dụ: "Tối thứ 3 tuần sau còn sân không?")`,
          facilities: facilities.slice(0, 5),
          courts: courts.slice(0, 5)
        };
      }
      return {
        message: 'Để kiểm tra sân trống, vui lòng cung cấp thông tin về thời gian bạn muốn (ví dụ: "Tối thứ 3 tuần sau còn sân không?", "Chiều nay tầm 5h-7h có sân nào trống?")',
        facilities: [],
        courts: []
      };
    
    case 'unknown':
    default:
      return {
        message: 'Xin lỗi, tôi chưa hiểu yêu cầu của bạn. Bạn có thể:\n- Tìm cơ sở gần nhất\n- Tìm sân giá rẻ\n- Đặt sân\n- Kiểm tra sân trống\n- Gợi ý sân phù hợp',
        facilities: [],
        courts: []
      };
  }
};

export default { analyzeIntent, generateResponse };

