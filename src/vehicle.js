const mqtt = require('mqtt');
const { v4: createId } = require('uuid');
const random = require('random');

const helpers = require('./helpers');

module.exports = class Vehicle {
    constructor(position, speed, route) {
        this.id = random.int(0, 10000).toString();
        this.position = position;
        this.speed = speed;
        this.route = route;
        this.state = 0;

        this.client = mqtt.connect('mqtt://broker.hivemq.com');
        this.client.on('connect', () => {
            this.client.subscribe(`to/vehicles/${this.id}/#`);
            this.client.subscribe(`to/vehicles/all/#`);

            this.publish(`from/vehicles/${this.id}/connected`);
        });

        this.client.on('message', (topic, message) => {
            message = message.toString();
            helpers.logReceive(this, topic, message);

            topic = topic.split('/');
            switch (topic[2]) {
                case this.id:
                    break;
                case 'all':
                    break;
            }
        });
    }

    destructor() {
        this.client.end();
    }

    toString() {
        return `Vehicle ${this.id}`;
    }

    publish(topic, message = "") {
        try {
            this.client.publish(topic, JSON.stringify(message));
            helpers.logPublish(this, topic, message);
        }
        catch (e) {
            console.log('Error:', e.toString())
        }
    }
};
