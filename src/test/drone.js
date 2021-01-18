const MQTTClient = require('./mqtt-client');

module.exports = class Drone extends MQTTClient {
    constructor(position) {
        super('drone', {
            move: function() { console.log('drone/move received!'); },
            report: function() { this.publish('state', this.position); }
        });
        this.position = position;
    }
};
