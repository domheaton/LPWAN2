// Author: Dominic Heaton
// Code to read temperature and humidity from dht11 sensor into ESP8266
// Then uploads result to Firebase database
// Power DHT11 Sensor from Vin (5V), GND, and DATA=PinD1
/* ------------------------------------------------------------------ */
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include "DHT.h"
#define DHTTYPE DHT11   // DHT 11
#define FIREBASE_HOST "esp8266-sensordata.firebaseio.com"
#define FIREBASE_AUTH "OBDCZYCOTqiB9vvnWse6Ewc1HZITysV4InL1EpHo"

//const char* ssid = "NOWTV6AAD7";
//const char* password = "LYYFLQBDDV";

const char* ssid = "dhh1g15";
const char* password = "123123123";

// Initialize DHT sensor.
const int DHTPin = 5;
DHT dht(DHTPin, DHTTYPE);
static char celsiusTemp[7];
static char humidityPercentage[7];

void setup() {
  Serial.begin(115200);
  delay(10);

  dht.begin();

  // Connecting to WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print("...");
  }
  Serial.println("");
  Serial.println("WiFi connected");
 
  // Firebase Setup
  Serial.println();
  Serial.println("Connecting to Firebase...");
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  if(Firebase.failed()) {
    Serial.println("Initialisation Failed");
    return;
  }
  if(Firebase.success()) {
    Serial.println("Firebase Initialised");
  }
}

void loop() {

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); //celcius by default
  if(isnan(humidity) || isnan(temperature)) { //if failed to read do the following
    Serial.println("Failed to read from sensor");
  }
  else {
    // For debugging
    Serial.println();
    Serial.print("Temperature: ");
    Serial.println(temperature);
    Serial.print("Humidity: ");
    Serial.println(humidity);

    // Upload temperature
    Firebase.setFloat("temperature", temperature);
    if (Firebase.failed()) {
      Serial.println("Firebase Temperature Upload failed");
      return;
    }
    else{
      Serial.println("Firebase Temperature Uploaded");
    }
    
    Firebase.setFloat("humidity", humidity);
    if (Firebase.failed()) {
      Serial.println("Firebase Humidity Upload failed:");
      Serial.println(Firebase.error()); 
      return;
    }
    else{
      Serial.println("Firebase Humidity Uploaded");
    }
  } 
//  delay(10000); // 10second delay
  delay(1000);
//  ESP.deepSleep(60e6, WAKE_RF_DEFAULT); // sleep time in micro-seconds
}
