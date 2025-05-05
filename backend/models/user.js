// User model functions
const { pool } = require("../db");
const bcrypt = require("bcrypt");

// Create users table if not exists
async function initializeUserTable() {
  try {
    const connection = await pool.getConnection();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Users table initialized successfully");
    connection.release();
  } catch (error) {
    console.error("Error initializing users table:", error);
    throw error;
  }
}

// Register a new user
async function registerUser(username, email, password) {
  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if username exists first
    const [usernameCheck] = await pool.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (usernameCheck.length > 0) {
      const error = new Error("Ce nom d'utilisateur est déjà pris");
      error.code = "ER_DUP_ENTRY";
      error.message = "username"; // Flag for identifying the field
      throw error;
    }

    // Check if email exists
    const [emailCheck] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (emailCheck.length > 0) {
      const error = new Error("Cet email est déjà utilisé");
      error.code = "ER_DUP_ENTRY";
      error.message = "email"; // Flag for identifying the field
      throw error;
    }

    // Insert the user into the database
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    return { id: result.insertId, username, email };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Login user
async function loginUser(email, password) {
  try {
    // Find user by email
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = rows[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { success: false, message: "Invalid password" };
    }

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    return { success: true, user: userData };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

// Get user by ID
async function getUserById(userId) {
  try {
    const [rows] = await pool.execute(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

// Update user
async function updateUser(userId, userData) {
  try {
    const { username, email, password } = userData;

    // Check for duplicates if username or email is changing
    if (username) {
      const [usernameCheck] = await pool.execute(
        "SELECT id FROM users WHERE username = ? AND id != ?",
        [username, userId]
      );

      if (usernameCheck.length > 0) {
        const error = new Error("Ce nom d'utilisateur est déjà pris");
        error.code = "ER_DUP_ENTRY";
        error.message = "username"; // Flag for identifying the field
        throw error;
      }
    }

    if (email) {
      const [emailCheck] = await pool.execute(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, userId]
      );

      if (emailCheck.length > 0) {
        const error = new Error("Cet email est déjà utilisé");
        error.code = "ER_DUP_ENTRY";
        error.message = "email"; // Flag for identifying the field
        throw error;
      }
    }

    // If password is provided, hash it
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await pool.execute(
        "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
        [username, email, hashedPassword, userId]
      );
    } else {
      await pool.execute(
        "UPDATE users SET username = ?, email = ? WHERE id = ?",
        [username, email, userId]
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

module.exports = {
  initializeUserTable,
  registerUser,
  loginUser,
  getUserById,
  updateUser,
};
