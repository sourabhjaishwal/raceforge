const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthService {
  // Generate JWT token
  generateToken(userId, role) {
    const payload = {
      userId,
      role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token valid for 7 days
    });

    return token;
  }

  // Register new user
  async register(email, password) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Create new user (password auto-hashed in pre-save hook)
    const user = await User.create({
      email,
      password,
    });

    // Generate JWT
    const token = this.generateToken(user._id, user.role);

    // Return user + token
    return {
      user: user.toJSON(),
      token,
    };
  }

  // Login existing user
  async login(email, password) {
    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("User not found");
    }

    // Check if email verified (for later)
    if (!user.isEmailVerified) {
      throw new Error("Please verify your email first");
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid password");
    }

    // Generate JWT
    const token = this.generateToken(user._id, user.role);

    return {
      user: user.toJSON(),
      token,
    };
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}

module.exports = new AuthService();
