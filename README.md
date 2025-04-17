# ESP32 Weather Station with Web Interface

This project combines an ESP32-based weather station with a web interface to display current and historical weather data.

## Project Components

1. **Arduino ESP32** - Collects temperature and humidity data from a DHT11 sensor and displays it on an LCD
2. **Backend Server** - Node.js Express server that receives data from ESP32 and stores it in MySQL
3. **Frontend Application** - React application that displays current and historical weather data with charts

## Hardware Requirements

- ESP32 development board
- DHT11 temperature and humidity sensor
- I2C LCD display (16x2)
- Jumper wires
- Breadboard
- USB cable for programming

## Hardware Setup

1. Connect DHT11 to ESP32:

   - VCC to 3.3V
   - GND to GND
   - DATA to GPIO4 (or pin specified in code)

2. Connect I2C LCD to ESP32:
   - VCC to 5V
   - GND to GND
   - SDA to GPIO21
   - SCL to GPIO22

## Software Setup

### Arduino Setup

1. Install the required libraries using Arduino Library Manager:

   - DHT sensor library by Adafruit
   - LiquidCrystal I2C by Frank de Brabander
   - ArduinoJson by Benoit Blanchon
   - WiFi, HTTPClient (included with ESP32 board)

2. Update the WiFi credentials and server URL in the WeatherStation.ino file
3. Upload the code to your ESP32

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Configure MySQL connection in `.env` file
4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Features

- Real-time temperature and humidity monitoring
- Data visualization with charts
- Historical data storage and retrieval
- Responsive web interface
- LCD display for direct readings

## Project Structure

```
/
├── arduino/
│   └── WeatherStation.ino      # ESP32 code
├── backend/
│   ├── server.js               # Express server
│   ├── db.js                   # Database connection
│   └── routes/                 # API routes
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page layouts
│   │   └── App.js              # Main application
│   └── public/                 # Static assets
└── README.md
```
