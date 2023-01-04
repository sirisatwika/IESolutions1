#!/usr/bin/python

import sys
import ssl
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import json
import time

print('Imported packages')
#Setup our MQTT client and security certificates
#Make sure your certificate names match what you downloaded from AWS IoT

mqttc = AWSIoTMQTTClient("1234")
print('Client created')

#Use the endpoint from the settings page in the IoT console
mqttc.configureEndpoint("a2twpak75lg757-ats.iot.us-east-1.amazonaws.com",8883)
mqttc.configureCredentials("./root-CA.crt","./awsnoderedthing.private.key","./awsnoderedthing.cert.pem")
print('Configured client')

#Function to encode a payload into JSON
def json_encode(string):
        return json.dumps(string)

mqttc.json_encode=json_encode

#Declaring our variables
vin = 'VIN-1234-567'
message ={
  'timestamp': time.ctime(),  
  'value':450.00,
  'trip_id' : 't_01',
  'vin' : vin,
  'name':'oil_temp',
}

#Encoding into JSON
message = mqttc.json_encode(message)
print('Encoded',message)

#This sends our test message to the iot topic
def send():
    mqttc.publish("connectedcar/telemetry/"+vin, message, 0)
    print("Message Published")


#Connect to the gateway
mqttc.connect()
print("Connected")

#Loop until terminated
while True:
    send()
    time.sleep(5)

mqttc.disconnect()

#To check and see if your message was published to the message broker go to the MQTT Client and subscribe to the iot topic and you should see your JSON Payload

