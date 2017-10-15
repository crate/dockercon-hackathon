-- create data table
CREATE TABLE sgmdata ("client_id" STRING, "packet_id" INTEGER, "topic" STRING, "ts" TIMESTAMP, "payload" OBJECT (IGNORED) AS ("ts" TIMESTAMP), PRIMARY KEY ("client_id", "packet_id"));

-- create ingest rule
CREATE INGEST RULE sgm ON MQTT WHERE TOPIC LIKE 'cratedb' INTO sgmdata;
