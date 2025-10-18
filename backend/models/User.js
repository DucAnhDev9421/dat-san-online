import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Thông tin cơ bản
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  
  // OAuth2 thông tin
  googleId: {
    type: String,
    unique: true,
    sparse: true // Cho phép null nhưng unique khi có giá trị
  },
  
  // Thông tin bổ sung
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  
  // Vai trò người dùng
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user'
  },
  
  // Trạng thái tài khoản
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Thông tin đăng nhập
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  
  // Mật khẩu (cho đăng ký thông thường, không bắt buộc với OAuth)
  password: {
    type: String,
    minlength: 6,
    select: false // Không trả về password trong query mặc định
  },
  
  // Refresh token cho JWT
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 ngày
    }
  }]
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index để tối ưu hóa truy vấn
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ role: 1 });

// Virtual field cho tên hiển thị
userSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0];
});

// Middleware trước khi lưu - hash password nếu có
userSchema.pre('save', async function(next) {
  // Chỉ hash password nếu nó được modify và không phải OAuth user
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method để so sánh password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method để cập nhật thông tin đăng nhập
userSchema.methods.updateLoginInfo = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

// Method để thêm refresh token
userSchema.methods.addRefreshToken = function(token) {
  if (!this.refreshTokens || !Array.isArray(this.refreshTokens)) {
    this.refreshTokens = [];
  }
  this.refreshTokens.push({ token });
  return this.save();
};

// Method để xóa refresh token
userSchema.methods.removeRefreshToken = function(token) {
  if (!this.refreshTokens || !Array.isArray(this.refreshTokens)) {
    this.refreshTokens = [];
  }
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
  return this.save();
};

// Static method để tìm user bằng Google ID
userSchema.statics.findByGoogleId = function(googleId) {
  return this.findOne({ googleId });
};

// Static method để tìm user bằng email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method để tạo user từ Google profile
userSchema.statics.createFromGoogleProfile = function(profile) {
  return this.create({
    googleId: profile.id,
    email: profile.emails[0].value,
    name: profile.displayName,
    avatar: profile.photos[0]?.value,
    isEmailVerified: true
  });
};

export default mongoose.model('User', userSchema);
