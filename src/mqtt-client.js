const mqtt = require('mqtt');
const { v4: createId } = require('uuid');
const random = require('random');

const helpers = require('./helpers');

module.exports = class MQTTClient {
    constructor(type, individualSubscriptions, typeSubscriptions, genericSubscriptions) {
        this.id = random.int(0, 10000).toString();
        this.type = type;
        this.individualSubscriptions = individualSubscriptions;
        this.typeSubscriptions = typeSubscriptions;
        this.genericSubscriptions = genericSubscriptions;

        this.client = mqtt.connect('mqtt://broker.hivemq.com');
        this.client.on('connect', () => {
            for (let topic in this.individualSubscriptions) {
                this.client.subscribe(`to/${this.type}/${this.id}/${topic}`);
            }

            this.publish('connected');
        });

        this.client.on('message', (topic, message) => {
            message = message.toString() ? JSON.parse(message.toString()) : '';
            helpers.logReceive(this, topic, message);

            topic = topic.split('/');
            if (topic[0] === 'to') {
                if (topic[2] === 'all') {
                    this.typeSubscriptions[topic.slice(3)].bind(this)(message);
                }
                else {
                    this.individualSubscriptions[topic.slice(3)].bind(this)(message);
                }
            }
            else {
                this.genericSubscriptions[topic.slice(3)].bind(this)(message);
            }
        });
    }

    destructor() {
        this.client.end();
    }

    toString() {
        return `${this.type.capitalize()} ${this.id}`;
    }

    publish(topic, message = "") {
        try {
            this.client.publish(`from/${this.type}/${this.id}/${topic}`, JSON.stringify(message));
            helpers.logPublish(this, `from/${this.type}/${this.id}/${topic}`, message);
        }
        catch (e) {
            console.log('Error:', e.toString())
        }
    }
};
