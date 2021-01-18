// External modules
const random = require('random');

// Own modules
const Vehicle = require('./vehicle');
const topology = require('../topology');

function randomRoute(length) {
    let start = random.int(0, topology.edges.length - 1);
    return Array.from({ length: length }, (_, i) => (start + i) % topology.edges.length);
}

module.exports = class VehicleSimulator {
    constructor(numberOfVehicles) {
        this.vehicles = Array.from({ length: numberOfVehicles }, () => new Vehicle(randomRoute(random.int(5, 10)), { edge: 0, position: 0.0 }, random.float()));
    }

    destructor() {
        this.vehicles.forEach(v => v.destructor());
    }
};
