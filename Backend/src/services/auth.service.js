const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

class AuthService {
  // Generate JWT token
  generateToken(userId, role) {
    const payload = {
      userId,
      role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return token;
  }

  // Register new user
  async register(email, password) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    // Create new user
    // Password is automatically hashed by the pre-save hook
    const newUser = await User.create({
      email,
      password,
    });

    // Return user information
    // Email verification should happen before login
    return {
      user: newUser.toJSON(),
    };
  }

  // Login existing user
  async login(email, password) {
    // Password has select: false, so explicitly include it
    const user = await User.findOne({ email }).select("+password");

    // Use the same error for invalid email/password
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new Error("Please verify your email first");
    }

    // Compare entered password with stored hash
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = this.generateToken(user._id.toString(), user.role);

    // Return user + token
    // toJSON() removes password
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
