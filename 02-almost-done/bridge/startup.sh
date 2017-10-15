#!/bin/sh

until $(curl --output /dev/null --silent --head --fail http://crate:4200); do
    printf '.'
    sleep 3
done

crash --hosts crate:4200 \
        -c 'CREATE TABLE sgmdata ("client_id" STRING, "packet_id" INTEGER, "topic" STRING, "ts" TIMESTAMP, "payload" OBJECT (IGNORED) AS ("ts" TIMESTAMP), PRIMARY KEY ("client_id", "packet_id"));'

crash --hosts crate:4200 \
        -c "CREATE INGEST RULE sgm ON MQTT WHERE TOPIC LIKE 'cratedb' INTO sgmdata;"

echo "start mqtt bridge"
mosquitto_sub -t 'sgm/#' -h mqtt.demo.cratedb.cloud | mosquitto_pub -t 'cratedb' -h crate -p 1883 -l -q 1
