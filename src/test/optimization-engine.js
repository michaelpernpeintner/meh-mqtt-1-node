const mqtt = require('mqtt');
const { v4: createId } = require('uuid');
const random = require('random');

const helpers = require('./helpers');

module.exports = class OptimizationEngine {
    constructor(topics = {}) {
        this.id = random.int(0, 10000).toString();
        this.topics = topics;
        this.client = mqtt.connect('mqtt://broker.hivemq.com');
        this.client.on('connect', () => {
            for (let name in topics) { this.client.subscribe(name); }
            this.publish('optimization-engine/connected', { id: this.id } );
        });

        this.client.on('message', (topic, message) => {
            message = message.toString();
            if (this.topics[topic]) {
                helpers.logReceive(this, topic, message);
                this.topics[topic](JSON.parse(message));
            }
            else {
                console.log(`Optimization Engine ${this.id}: Error when receiving "${message}" on topic "${topic}".`);
            }
        });
    }

    destructor() {
        this.client.end();
    }

    toString() {
        return `Optimization Engine ${this.id}`;
    }

    publish(topic, message) {
        try {
            this.client.publish(topic, JSON.stringify(message));
            helpers.logPublish(this, topic, message);
        }
        catch (e) {
            console.log('Error:', e.toString())
        }
    }
};
