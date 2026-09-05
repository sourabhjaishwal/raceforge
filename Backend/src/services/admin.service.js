const User = require("../models/user.model");

/**
 * @name Admin Service
 * @description Contains administrative operations for managing users
 */

class AdminService {
  /**
   * @name Promote User
   * @description Promote an existing user to the admin role using their email address
   */
  async promoteUser(email) {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.role === "admin") {
      const error = new Error("User is already an admin");
      error.statusCode = 400;
      throw error;
    }

    user.role = "admin";
    await user.save();
    return user;
  }
}

module.exports = new AdminService();
