# Guide de démarrage de la Station Météo IoT

Ce guide vous aide à mettre en place et exécuter chaque composant du projet de station météo.

## Configuration du matériel (Arduino ESP32)

### Composants nécessaires

- ESP32 (WROOM, WROVER, ou similaire)
- Capteur DHT11 (température et humidité)
- Écran LCD I2C 16x2
- Fils de connexion
- Breadboard
- Câble USB pour la programmation

### Branchement

1. **DHT11 vers ESP32**:

   - VCC du DHT11 vers 3.3V de l'ESP32
   - GND du DHT11 vers GND de l'ESP32
   - DATA du DHT11 vers GPIO4 de l'ESP32

2. **Écran LCD I2C vers ESP32**:
   - VCC vers 5V de l'ESP32
   - GND vers GND de l'ESP32
   - SDA vers GPIO21 de l'ESP32
   - SCL vers GPIO22 de l'ESP32

### Configuration du code Arduino

1. Ouvrez le fichier `arduino/WeatherStation.ino` dans l'IDE Arduino
2. Installez les bibliothèques nécessaires via le Gestionnaire de bibliothèques:
   - DHT sensor library
   - LiquidCrystal I2C
   - ArduinoJson
3. Modifiez les variables suivantes dans le code:
   ```cpp
   const char* ssid = "VOTRE_SSID_WIFI";
   const char* password = "VOTRE_MOT_DE_PASSE_WIFI";
   const char* serverUrl = "http://adresse-de-votre-serveur:3001/api/weather";
   ```
4. Chargez le code sur votre ESP32

## Configuration de la base de données

1. Installez MySQL sur votre système si ce n'est pas déjà fait
2. Créez une base de données et un utilisateur:
   ```sql
   CREATE DATABASE weather_station;
   CREATE USER 'weather_user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON weather_station.* TO 'weather_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Importez les données de test (optionnel):
   ```
   mysql -u weather_user -p weather_station < backend/mock-data.sql
   ```
4. Modifiez le fichier `backend/.env` avec vos informations de connexion:
   ```
   DB_HOST=localhost
   DB_USER=weather_user
   DB_PASSWORD=password
   DB_NAME=weather_station
   DB_PORT=3306
   ```

## Démarrage du Backend

1. Installez Node.js sur votre système si ce n'est pas déjà fait (v14+ recommandé)
2. Accédez au dossier backend:
   ```
   cd backend
   ```
3. Installez les dépendances:
   ```
   npm install
   ```
4. Démarrez le serveur:
   ```
   npm start
   ```
   Ou en mode développement:
   ```
   npm run dev
   ```
5. Le serveur devrait démarrer sur http://localhost:3001

## Démarrage du Frontend

1. Accédez au dossier frontend:
   ```
   cd frontend
   ```
2. Installez les dépendances:
   ```
   npm install
   ```
3. Démarrez l'application:
   ```
   npm start
   ```
4. L'application devrait s'ouvrir dans votre navigateur à http://localhost:3000

## Tester l'application complète

1. Assurez-vous que le backend est en cours d'exécution
2. Assurez-vous que le frontend est en cours d'exécution
3. Programmez l'ESP32 avec les informations de connexion correctes
4. Mettez l'ESP32 sous tension
5. Ouvrez l'application web dans votre navigateur

L'ESP32 devrait maintenant envoyer les données au backend, et le frontend devrait afficher les données en temps réel avec un graphique.
