const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// POST - Save weather data from ESP32
router.post("/", async (req, res) => {
  try {
    const { temperature, humidity } = req.body;

    // Validate input
    if (temperature === undefined || humidity === undefined) {
      return res
        .status(400)
        .json({ error: "Temperature and humidity are required fields" });
    }

    // Save to database
    const [result] = await pool.execute(
      "INSERT INTO weather_data (temperature, humidity) VALUES (?, ?)",
      [temperature, humidity]
    );

    // Emit to connected clients
    req.app
      .get("io")
      .emit("newWeatherData", { temperature, humidity, timestamp: new Date() });

    res.status(201).json({
      message: "Weather data saved successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error saving weather data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving weather data" });
  }
});

// GET - Get latest weather data
router.get("/latest", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM weather_data ORDER BY timestamp DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No weather data found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching latest weather data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching latest weather data" });
  }
});

// GET - Get weather data for a specific day
router.get("/daily/:date", async (req, res) => {
  try {
    const date = req.params.date; // Format: YYYY-MM-DD

    const [rows] = await pool.execute(
      "SELECT * FROM weather_data WHERE DATE(timestamp) = ? ORDER BY timestamp",
      [date]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching daily weather data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching daily weather data" });
  }
});

// GET - Get weather data for the current day
router.get("/today", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM weather_data WHERE DATE(timestamp) = CURDATE() ORDER BY timestamp"
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching today's weather data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching today's weather data" });
  }
});

module.exports = router;
