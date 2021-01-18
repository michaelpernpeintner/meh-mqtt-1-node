// External modules
const random = require('random');

// Own modules
const MQTTClient = require('../mqtt-client');

const topology = require('../topology');
const helpers = require('../helpers');

// Constants
const reportingInterval = 500; // ms


module.exports = class Vehicle extends MQTTClient {
    constructor(route, position, speed) {
        super('vehicle', {}, {}, {});

        this.route = route;
        this.position = position;
        this.speed = speed;

        this.intervalTimer = setInterval(() => { this.move(); }, reportingInterval);
        this.lastUpdateTime = Date.now();
    };

    destructor() {
        super.destructor();
        clearInterval(this.intervalTimer);
    }

    description() {
        return `Vehicle ${this.id} { pos: ${JSON.stringify(this.position)}, speed: ${this.speed}, route: ${this.route}`;
    }

    move() {
        let interval = (Date.now() - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = Date.now();

        let newPosition = this.position.position + interval * this.speed;
        if (newPosition < 1.0) {
            this.position.position += interval * this.speed;
        }
        else {
            if (this.position.edge < this.route.length - 1) {
                this.position.edge++;
                this.position.position = newPosition - 1.0;
            }
            else {
                this.position.position = 1.0;
                clearInterval(this.intervalTimer);
            }
        }

        helpers.logInfo(`Vehicle ${this.id} moved to ${JSON.stringify(this.position)} in ${interval} seconds.`);
    }
};
