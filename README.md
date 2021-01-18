# MEH-MQTT: node.js-based simulation environment MQTT communication in the mobil-e-Hub project
Authors: 
- Michael Pernpeintner (pernpeintner@es.uni-mannheim.de)
- Alexander Becker (albecker@mail.uni-mannheim.de)

## Purpose
The purpose of this project is to provide a simulation of drones, transport vehicles and customer orders for the mobil-e-Hub project. The optimization of drone routes is performed by an optimization engine which is not part of this project.

## Architecture
The project consists of three independent modules (DroneSimulator, VehicleSimulator and OrderSimulator). These modules are initialized, started and stopped in `src/index_old.js`.
Each module manages a number of entities (drones, vehicles and parcels, respectively). Each entity is an MQTT client with the ability to receive and publish messages to a central broker.

### Class `MQTTClient`

### Class `Drone`

### Class `Vehicle`

### Class `Parcel`
