const mysql = require("mysql2/promise");
require("dotenv").config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database (create tables if they don't exist)
async function initializeDb() {
  try {
    const connection = await pool.getConnection();

    // Create weather_data table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS weather_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        temperature FLOAT NOT NULL,
        humidity FLOAT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database initialized successfully");
    connection.release();
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

module.exports = {
  pool,
  initializeDb,
};
