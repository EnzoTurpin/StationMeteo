# Station Météo IoT avec ESP32 et Interface Web

Ce projet est une solution complète de station météo connectée, composée d'un ESP32 qui collecte des données environnementales (température et humidité), d'un backend Node.js qui stocke ces données, et d'une interface web React pour visualiser les informations en temps réel et historiques.

## Architecture du Projet

Le projet est divisé en trois composants principaux :

1. **Arduino ESP32** - Dispositif physique avec capteurs qui collecte et affiche les données sur un écran OLED
2. **Backend** - Serveur Node.js avec broker MQTT intégré qui reçoit, stocke et distribue les données
3. **Frontend** - Application web React qui affiche les données météo en temps réel avec des graphiques

## Prérequis

- Node.js (v14+ recommandé)
- npm (inclus avec Node.js)
- MySQL
- Extension PlatformIO pour programmer l'ESP32
- ESP32 avec capteurs (DHT11 et écran OLED)

## Installation et Configuration

### 1. Configuration matérielle (ESP32)

#### Composants nécessaires

- ESP32 (WROOM, WROVER, ou similaire)
- Capteur DHT11 (température et humidité)
- Écran OLED
- Fils de connexion et breadboard

#### Branchements

- **DHT11**:

  - VCC → 3.3V
  - GND → GND
  - DATA → GPIO18 (configurable dans le code)

- **Écran OLED**:
  - VCC → 5V
  - GND → GND
  - SDA → GPIO21 (I2C)
  - SCL → GPIO22 (I2C)

#### Programmation de l'ESP32

1. Ouvrez le projet dans PlatformIO (dossier `arduino/stationMeteo`)
2. Installez les dépendances (définies dans platformio.ini)
3. Configurez vos informations MQTT et WiFi dans le code si nécessaire
4. Téléversez le code vers l'ESP32

### 2. Configuration du Backend

1. Naviguez vers le dossier backend:

   ```
   cd backend
   ```

2. Installez les dépendances:

   ```
   npm install
   ```

3. Créez un fichier `.env` avec les configurations suivantes:

   ```
   PORT=3001
   MQTT_PORT=1883
   MQTT_WS_PORT=8888

   DB_HOST=localhost
   DB_USER=votre_utilisateur
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=weather_station

   JWT_SECRET=votre_clé_secrète_pour_jwt
   ```

4. Configurez la base de données MySQL:

   ```sql
   CREATE DATABASE weather_station;
   CREATE USER 'votre_utilisateur'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
   GRANT ALL PRIVILEGES ON weather_station.* TO 'votre_utilisateur'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. Importez le schéma et les données de test (facultatif):

   ```
   mysql -u votre_utilisateur -p weather_station < mock-data.sql
   ```

6. Démarrez le serveur:
   ```
   npm start
   ```
   ou en mode développement:
   ```
   npm run dev
   ```

### 3. Configuration du Frontend

1. Naviguez vers le dossier frontend:

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
4. L'interface sera accessible à l'adresse http://localhost:3000

## Test du système complet

1. Assurez-vous que le backend est en cours d'exécution
2. Lancez l'application frontend
3. Vérifiez que l'ESP32 est programmé et alimenté
4. Vous pouvez également utiliser le script de test MQTT pour simuler des données:
   ```
   node test-mqtt-sensor.js
   ```

## Structure du projet

```
/
├── arduino/
│   └── stationMeteo/          # Projet PlatformIO pour ESP32
│       └── src/
│           └── main.cpp       # Code principal ESP32
├── backend/
│   ├── server.js              # Serveur Express et broker MQTT
│   ├── db.js                  # Configuration base de données
│   ├── routes/                # Routes API
│   ├── models/                # Modèles de données
│   └── mock-data.sql          # Données de test
├── frontend/
│   ├── src/                   # Code source React
│   └── public/                # Ressources statiques
├── test-mqtt-sensor.js        # Script de test pour simuler un capteur
└── README.md                  # Ce fichier
```

## Fonctionnalités

- Collecte et affichage de la température et humidité en temps réel
- Communication MQTT entre l'ESP32 et le serveur
- Interface web responsive avec graphiques d'historique
- Authentification des utilisateurs
- Stockage des données dans une base de données MySQL
- Visualisation des données sur l'écran OLED de l'ESP32

## Dépannage

- **L'ESP32 ne se connecte pas** : Vérifiez les identifiants WiFi et l'adresse IP du broker MQTT
- **Pas de données dans l'interface web** : Vérifiez que le broker MQTT fonctionne correctement
- **Erreurs de base de données** : Vérifiez les identifiants dans le fichier .env
