FROM debian:jessie

# Build-time metadata as defined at http://label-schema.org
ARG BUILD_DATE
ARG VCS_REF
LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.docker.dockerfile="/Dockerfile" \
    org.label-schema.license="BSD 3-Clause" \
    org.label-schema.name="docker-mosquitto" \
    org.label-schema.url="https://hub.docker.com/r/toke/mosquitto/" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-type="Git" \
    org.label-schema.vcs-url="https://github.com/toke/docker-mosquitto"

RUN apt-get update && apt-get install -y wget && \
    wget -q -O - https://repo.mosquitto.org/debian/mosquitto-repo.gpg.key | gpg --import && \
    gpg -a --export 8277CCB49EC5B595F2D2C71361611AE430993623 | apt-key add - && \
    wget -q -O /etc/apt/sources.list.d/mosquitto-jessie.list https://repo.mosquitto.org/debian/mosquitto-jessie.list && \
    apt-get update && apt-get install -y mosquitto mosquitto-clients curl python3-pip &&\
    adduser --system --disabled-password --disabled-login mosquitto

RUN pip3 install crash

# RUN mkdir -p /mqtt/config /mqtt/data /mqtt/log
# COPY config /mqtt/config
# RUN chown -R mosquitto:mosquitto /mqtt
# VOLUME ["/mqtt/config", "/mqtt/data", "/mqtt/log"]

# ADD docker-entrypoint.sh /usr/bin/
# ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]

# RUN crash crate:4200 \
#         -c 'CREATE TABLE mosquitto ("client_id" STRING, "packet_id" INTEGER, "topic" STRING, "ts" TIMESTAMP, "payload" OBJECT(IGNORED), PRIMARY KEY ("client_id", "packet_id"));'
# RUN crash --hosts crate:4200 \
#         -c "CREATE INGEST RULE mosquitto ON MQTT WHERE TOPIC LIKE 'cratedb' INTO mosquitto;"
#
# CMD ["/usr/sbin/mosquitto", "-c", "/mqtt/config/mosquitto.conf"]
ADD startup.sh /usr/bin/
CMD ["/usr/bin/startup.sh"]
