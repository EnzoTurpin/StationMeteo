#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Capteur DHT
#define DHTPIN 18     
#define DHTTYPE DHT11
DHT_Unified dht(DHTPIN, DHTTYPE);
uint32_t delayMS;

// Ecran OLED
#define SCREEN_WIDTH 128 
#define SCREEN_HEIGHT 64 
#define OLED_RESET    -1 
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  Serial.begin(115200);

  // Initialisation de l'écran OLED
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("Erreur initialisation écran SSD1306"));
    for(;;);
  }
  display.clearDisplay();
  display.display();
  
  // Initialisation du capteur DHT
  dht.begin();
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
  delayMS = sensor.min_delay / 1000;
}

void loop() {
  delay(2000);

  // Lecture des données du capteur
  sensors_event_t event;
  
  // Température
  dht.temperature().getEvent(&event);
  float temperature = NAN;
  if (!isnan(event.temperature)) {
    temperature = event.temperature;
  }

  // Humidité
  dht.humidity().getEvent(&event);
  float humidity = NAN;
  if (!isnan(event.relative_humidity)) {
    humidity = event.relative_humidity;
  }

  // Affichage sur le moniteur série
  Serial.print(F("Température: "));
  Serial.print(temperature);
  Serial.println(F("°C"));

  Serial.print(F("Humidité: "));
  Serial.print(humidity);
  Serial.println(F("%"));

  // Affichage sur l'écran OLED
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  
  if (!isnan(temperature)) {
    display.print("Temp: ");
    display.print(temperature, 1);
    display.println(" C");
  } else {
    display.println("Temp Err");
  }

  if (!isnan(humidity)) {
    display.print("Hum: ");
    display.print(humidity, 1);
    display.println(" %");
  } else {
    display.println("Hum Err");
  }

  display.display();
}
