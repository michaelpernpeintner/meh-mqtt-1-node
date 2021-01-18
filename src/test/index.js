const mqtt = require('mqtt');

const Drone = require('./drone');

const helpers = require('../helpers');

let d = new Drone({ x: 5, y: 7 });

let client = mqtt.connect('mqtt://broker.hivemq.com');
client.on('connect', () => {
    client.subscribe('from/drone/+/connected');
    client.subscribe('from/drone/+/state');

    main();
});

let toString = () => {
    return 'Client';
};

client.on('message', (topic, message) => {
    message = message.toString() ? JSON.parse(message.toString()) : '';
    helpers.logReceive(this, topic, message);
});

let main = async () => {
    client.publish(`to/drone/${d.id}/report`, '');
    helpers.logPublish(this, `to/drone/${d.id}/report`, '');

    await setTimeout(() => {
        d.destructor();
        client.end();
    }, 10000);
};
