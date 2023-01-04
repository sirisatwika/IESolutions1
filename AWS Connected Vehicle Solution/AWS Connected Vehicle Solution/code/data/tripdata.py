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
ig_status = 'off'
vin = 'VIN-2889-432'
message ={
    "vehicle_speed_mean" : 100.5,
    "idle_duration" : 15,
    "accelerator_pedal_position_mean" : 11.6,
    "trip_id" : "t_03",
    "odometer" : 98.9,
    "fuel_level" : 206,
    "engine_speed_mean" : 80.3,
    "high_braking_event": 6,
    "high_acceleration_event": 7,
    "high_speed_duration": 8,
    "end_time" : "2022-12-07T16:32:00.000Z",
    "start_longitude" : 80.3,
    "start_time" : "2022-12-07T16:25:00.000Z",
    "torque_at_transmission_mean" :11.2,
    "brake_mean" : 20.0,
    "stop_longitude" : 100.7,
    "fuel_consumed_since_restart" : 50.0,
    "oil_temp_mean" : 30.6,
    "start_latitude" : 200.5,
    "vin" : vin,
    "stop_latitude" : 100.2,
    'ignition_status' : ig_status,
}

#Encoding into JSON
message = mqttc.json_encode(message)
print('Encoded',message)

#This sends our test message to the iot topic
def send():
    mqttc.publish("connectedcar/trip/"+vin, message, 0)
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

