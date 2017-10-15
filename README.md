# Welcome to the Hackathon Before DockerCon Europe CrateDB Challenge!
## [https://cr8.is/dockercon-hackathon](https://cr8.is/dockercon-hackathon)

Welcome to the DockerCon Hackathon Crate.io challenge.
If you have any questions feel free to ask Allison, Mika, Max or Joe.
Also let us now when you want to participate.

CrateDB is a distributed, horizontal scaling, SQL based Database
for the machine data era. You can get an basic overview here: https://crate.io/overview/

You can also use our documentation as a starting point: https://crate.io/docs/crate/reference/en/latest/index.html

We have two setups for two different levels of Docker Know-how.

Start off with our prepared setups by running:

```
git clone https://github.com/crate/dockercon-hackathon.git
```

You can also download it here: https://github.com/crate/dockercon-hackathon/archive/master.zip

Of course you need Docker installed on your machine.
Get it from https://www.docker.com.


## The Basic Idea

A lot of CrateDB users use the database for IoT heavy use cases. Especially in
scenario where sensors send signals about the current state of a machine.
We have a simulation of a
[Kuka Robot](https://www.kuka.com/de-de/produkte-leistungen/robotersysteme/industrieroboter) 
which is taking parts from a car, checking their position, turning them to the right angle and
handing it over to the next machine. This Kuka robot then sends a MQTT stream of the
position it gets from a camera sensor.

The idea is: 

* Setup a CrateDB instance
* consume the MQTT stream via the MQTT endpoint
* Enrich the data
* Visualize it in a visualization tool like Grafana
* You can also do advanced stuff like machine learning

We have the [`almost-done`](https://github.com/crate/dockercon-hackathon/tree/master/02-almost-done) setup in which almost everything is already in place.
You can just run `docker-compose up` and you'll have an MQTT bridge, a CrateDB
instance, the enrichment code connected and a Grafana instance with some
demo visualizations in place. You can use that to build more advanced 
visualizations or add Machine Learning containers. 

There's also the [`fresh start`](https://github.com/crate/dockercon-hackathon/tree/master/01-fresh-start) setup.
In this setup there is a Docker Compose YML in place, that installs the MQTT bridge. There's also the code for
an enrichment process that you can use.

Be aware that you need to use the `crate/crate:2.2.0` tag in Docker as only this
release contains the MQTT endpoint.


## [The Fresh Start Setup](https://github.com/crate/dockercon-hackathon/tree/master/01-fresh-start)

There is a Docker Compose YML for initiating the bridge container. The bridge container
contains a Dockerfile and a startup script. In the aggregate folder there is 
a Dockerfile ready to build an aggregation container based on Node.js.
When adding the aggregate container to the setup
be sure to pass the environment variable `CRATE_HOST`. Other than that, you can setup 
a CrateDB container and run the scripts in `queries.sql` to generate the right DB
configuration. Then you need to adopt the startup script in the bridge. 
Feel free to come up with your own data pipeline. 

You could also have a look at the `Almost Done Setup` to see how things could fit together.



## [The Almost Done Setup](https://github.com/crate/dockercon-hackathon/tree/master/02-almost-done)

In this setup there is almost everything done. Run `docker-compose up` in the
`02-almost-done` folder to start the environment. You are then able to open 
`http://localhost:4200` in your browser
to access the CrateDB admin UI. Via `http://localhost:3000` you can access 
Grafana. Credentials are the Grafana defaults `admin:admin`. 

There are two tables, the `sgmdata` containing the raw MQTT data and the 
`sgmdata_aggregated` containing the enriched dataset.

You can use this as a starting point to make your visualizations or run 
Machine Learning scripts on the data. For this purpose, we also added data in the exports
folder which you can use to train machine learning models.


## Useful links

* CrateDB documentation: https://crate.io/docs/crate/reference/en/latest/
* CrateDB Docker documentation: https://hub.docker.com/r/crate/crate/
* CrateDB Ingestion framework: https://crate.io/docs/crate/reference/en/latest/ingestion.html
* Grafana documentation: http://docs.grafana.org/
* Grafana: https://hub.docker.com/r/grafana/grafana/
* Mosquitto Pub: https://mosquitto.org/man/mosquitto_pub-1.html
* Mosquitto Sub: https://mosquitto.org/man/mosquitto_sub-1.html
