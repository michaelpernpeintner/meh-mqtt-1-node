const mqtt = require('mqtt');
const { v4: createId } = require('uuid');
const random = require('random');

const helpers = require('./helpers');

module.exports = class CustomerSimulator {
    constructor(type, data) {
        this.id = '';
        this.client = mqtt.connect('mqtt://broker.hivemq.com');
        this.client.on('connect', () => {
            this.publish('customer-simulator/connected');
        });

        if (type === 'fixed') {
            data.forEach(order => setTimeout(() => { this.publish('order/received', {
                id: random.int(0, 10000).toString(),
                from: order.from,
                to: order.to
            }) }, order.time));
        }
        else if (type === 'random') {

        }
        else {

        }
    }

    destructor() {
        this.client.end();
    }

    toString() {
        return `Customer Simulator`;
    }

    makeOrder() {
        this.publish('order/received', {
            id: createId(),
            from: { x: random.int(-20, 20), y: random.int(-20, 20) },
            to: { x: random.int(-20, 20), y: random.int(-20, 20) } }
        );
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
