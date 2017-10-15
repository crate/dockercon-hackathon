# Hackathon Before DockerCon Europe!

Welcome to the DockerCon Hackathon Crate.io challenge.
If you have any questions feel free to ask Allison, Mika, Max or Joe.

We got two setups for two different levels of Docker Know-how.

## The Basic Idea

A lot of CrateDB users use CrateDB for IoT heavy use cases. Especially in
the industry where sensors send signals about the current state of a machine.
We got an simulation of a [Kuka Robot](https://www.kuka.com/de-de/produkte-leistungen/robotersysteme/industrieroboter) which is taking parts from a car, checking in 
which position they are, turning them in the right angle and 
handing it over to the next machine. This Kubka robot is sending a
MQTT stream of the position it gets from a camera. The idea is to 
setup a CrateDB instance, consume the
MQTT stream via the MQTT endpoint, enrich the data and then visualize it
in a visualization tool like Grafana. You can also do advanced stuff
like machine learning.

We got the `almost-done` setup in which almost everything is already in place.
You can just run `docker-compose up` and you'll have an MQTT bridge, a CrateDB
instance, the enrichment code connected and a Grafana instance with some
demo visualizations in place. You can use that to build more advanced 
visualizations or add Machine Learning containers. 

There's also the `fresh start` setup. In this setup there is a Docker
Compose YML in place, that installs the MQTT bridge. There's also the code for 
an possible enrichment process.

Be aware that you need to use `crate/crate:2.2.0` in Docker as this contains
the MQTT endpoint.


## The Fresh Start Setup

There is a Docker Compose YML tearing up the bridge container. The bridge container
contains a Dockerfile and a startup script. In the aggregate folder there is 
a Dockerfile ready. When adding the aggregate container to the setup
be sure to pass the environment variable `CRATE_HOST`. Other than that you can setup 
a CrateDB container, run the scripts in `queries.sql` to generate the right DB
configuration. Then you need to adopt the startup script in the bridge.



## The Almost Done Setup

In this setup there is almost everything done. Run `docker-compose up` to start 
the environment. You are then able to open `http://localhost:4200` in your browser
to access the CrateDB admin backend. Via `http://localhost:3000` you can access 
Grafana. Credentials are the Grafana defaults `admin:admin`. 

There are two tables, the `sgmdata` containing the raw MQTT data and the 
`sgmdata_aggregated` containing the enriched dataset.

You can use this as a starting point to make your visualizations or run 
Machine Learning scripts on the data. There for we added data in the exports
folder which you can use to train models.


## Useful links

* CrateDB documentation: https://crate.io/docs/crate/reference/en/latest/
* CrateDB Docker documentation: https://hub.docker.com/r/crate/crate/
* CrateDB Ingestion framework: https://crate.io/docs/crate/reference/en/latest/ingestion.html
* Grafana documentation: http://docs.grafana.org/
* Grafana: https://hub.docker.com/r/grafana/grafana/
* Mosquitto Pub: https://mosquitto.org/man/mosquitto_pub-1.html
* Mosquitto Sub: https://mosquitto.org/man/mosquitto_sub-1.html