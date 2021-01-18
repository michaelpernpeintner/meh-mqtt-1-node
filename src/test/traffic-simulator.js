const mqtt = require('mqtt');
const { v4: createId } = require('uuid');
const random = require('random');

const helpers = require('./helpers');

module.exports = class TrafficSimulator {
    constructor() {
        this.id = random.int(0, 10000).toString();
        this.client = mqtt.connect('mqtt://broker.hivemq.com');
        this.client.on('connect', () => {
            this.publish(`from/traffic-simulator/${this.id}/connected`);
        });

        this.client.on('message', (topic, message) => {
            message = message.toString();
            helpers.logReceive(this, topic, message);

            topic = topic.split('/');
            switch (topic[2]) {

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
