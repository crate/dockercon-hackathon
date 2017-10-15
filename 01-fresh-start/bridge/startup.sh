#!/bin/sh

echo "start mqtt bridge"
mosquitto_sub -t 'sgm/#' -h mqtt.demo.cratedb.cloud | mosquitto_pub -t 'cratedb' -h crate -p 1883 -l -q 1
