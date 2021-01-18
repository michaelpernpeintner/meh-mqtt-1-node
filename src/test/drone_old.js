const mqtt = require('mqtt');
const { v4: createId } = require('uuid');
const random = require('random');

const helpers = require('./helpers');

const nativeTopics = {
    'drone/move': function (self, message) {
        if (message.id === self.id) {
            switch (message.type) {
                case 'to':
                    self.moveTo(message.x, message.y);
                    break;
                case 'by':
                    self.moveBy(message.x, message.y);
                    break;
            }
        }
    },
    'optimization-engine/connected': (self, message) => {
        this.publish('drone/state', { id: this.id, position: this.position });
    },
    'optimization-engine/update-route/+': function (self, message) {

    },
};

module.exports = class Drone {
    constructor(topics = {}) {
        this.id = random.int(0, 10000).toString();
        this.position = { x: 0, y: 0 };
        this.goal = { x: 0, y: 0 };
        this.moving = false;
        this.topics = topics;
        this.client = mqtt.connect('mqtt://broker.hivemq.com');
        this.client.on('connect', () => {
            this.client.subscribe('optimization-engine/connected');
            for (let name in topics) { this.client.subscribe(name); }
            for (let name in nativeTopics) { this.client.subscribe(name); }
            this.publish('drone/connected', { id: this.id } );
        });

        this.client.on('message', (topic, message) => {
            message = message.toString();
            helpers.logReceive(this, topic, message);

            switch (topic) {
                case 'optimization-engine/connected':
                    this.publishState();
                    break;
                case `optimization-engine/update-route/${this.id}`:
                    break;
            }
            // if (nativeTopics[topic]) {
            //     helpers.logReceive(this, topic, message);
            //     nativeTopics[topic](this, JSON.parse(message));
            // }
            // else if (this.topics[topic]) {
            //     helpers.logReceive(this, topic, message);
            //     this.topics[topic](JSON.parse(message));
            // }
            // else {
            //     console.log(`Drone ${this.id}: Error when receiving "${JSON.stringify(message)}" on topic "${topic}".`);
            // }
        });
    }

    destructor() {
        this.client.end();
    }

    toString() {
        return `Drone ${this.id}`;
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

    moveTo(x, y) {
        this.goal = { x, y };
        if (!this.moving) {
            setTimeout(() => { this.move(); }, 500);
            this.moving = true;
        }
    }

    moveBy(x, y) {
        this.goal.x += x;
        this.goal.y += y;
        if (!this.moving) {
            setTimeout(() => { this.move(); }, 500);
            this.moving = true;
        }
    }

    move() {
        this.position.x += Math.min(Math.max(-1, this.goal.x - this.position.x), 1);
        this.position.y += Math.min(Math.max(-1, this.goal.y - this.position.y), 1);

        if (this.position.x !== this.goal.x || this.position.y !== this.goal.y) {
            setTimeout(() => { this.move(); }, 500);
        }
        else {
            this.moving = false;
        }

        this.publish('drone/state', { id: this.id, position: this.position });
    }

    publishState() {
        this.publish(`drone/state/${this.id}`, { position: this.position });
    }
};
