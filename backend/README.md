# Backend - Đặt Sân Online

Backend API cho ứng dụng đặt sân bóng online với Google OAuth2 authentication và MongoDB.

## 🚀 Tính năng

- ✅ Google OAuth2 Authentication
- ✅ JWT Token Management
- ✅ MongoDB Database
- ✅ User Management
- ✅ Role-based Access Control
- ✅ Rate Limiting
- ✅ Security Middleware
- ✅ Error Handling

## 📋 Yêu cầu hệ thống

- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm hoặc yarn

## 🛠️ Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `backend`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/dat-san-online

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your_super_secret_session_key_here_make_it_long_and_random

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Cấu hình Google OAuth2

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Google+ API
4. Tạo OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
5. Copy Client ID và Client Secret vào file `.env`

### 4. Khởi động MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**MongoDB Atlas:**
- Tạo cluster trên [MongoDB Atlas](https://www.mongodb.com/atlas)
- Copy connection string vào `MONGODB_URI`

### 5. Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google` | Khởi tạo Google OAuth2 |
| GET | `/api/auth/google/callback` | Google OAuth2 callback |
| POST | `/api/auth/logout` | Đăng xuất |
| POST | `/api/auth/refresh` | Refresh JWT token |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |
| PUT | `/api/auth/profile` | Cập nhật profile |
| PUT | `/api/auth/role/:userId` | Thay đổi role (admin only) |
| GET | `/api/auth/users` | Lấy danh sách users (admin only) |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Kiểm tra trạng thái server |

## 🔐 Authentication Flow

1. **Google OAuth2 Login:**
   ```
   Frontend → GET /api/auth/google → Google → /api/auth/google/callback → Frontend
   ```

2. **JWT Token Management:**
   - Access Token: 15 phút
   - Refresh Token: 7 ngày
   - Tự động refresh khi cần

3. **Protected Routes:**
   ```
   Authorization: Bearer <access_token>
   ```

## 👥 User Roles

- **user**: Người dùng thông thường
- **owner**: Chủ sân bóng
- **admin**: Quản trị viên

## 🛡️ Security Features

- Helmet.js cho security headers
- CORS configuration
- Rate limiting
- JWT token validation
- Password hashing với bcrypt
- Session management
- Input validation

## 📁 Cấu trúc thư mục

```
backend/
├── config/
│   ├── config.js          # Cấu hình ứng dụng
│   ├── database.js        # Kết nối MongoDB
│   └── passport.js        # Passport.js configuration
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── errorHandler.js   # Error handling
│   └── rateLimiter.js    # Rate limiting
├── models/
│   └── User.js           # User model
├── routes/
│   └── auth.js           # Authentication routes
├── server.js             # Main server file
├── package.json          # Dependencies
└── README.md            # Documentation
```

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB
```bash
# Kiểm tra MongoDB đang chạy
mongosh --eval "db.adminCommand('ismaster')"
```

### Lỗi Google OAuth2
- Kiểm tra Client ID và Client Secret
- Đảm bảo redirect URI đúng
- Kiểm tra Google+ API đã được kích hoạt

### Lỗi CORS
- Kiểm tra `FRONTEND_URL` trong `.env`
- Đảm bảo frontend đang chạy trên đúng port

## 📝 Scripts

```bash
npm start          # Chạy production
npm run dev        # Chạy development với nodemon
npm test           # Chạy tests (chưa implement)
```

## 🔄 Development

Để phát triển thêm tính năng:

1. Tạo model mới trong `models/`
2. Tạo routes trong `routes/`
3. Thêm middleware nếu cần trong `middleware/`
4. Cập nhật `server.js` để import routes mới

## 📞 Support

Nếu gặp vấn đề, vui lòng tạo issue hoặc liên hệ team phát triển.
