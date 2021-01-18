// External modules
const inquirer = require('inquirer');

// Own modules
const VehicleSimulator = require('./vehicle-simulator/vehicle-simulator');
// const DroneSimulator = require('./drone-simulator/drone-simulator');
// const OrderSimulator = require('./order-simulator/order-simulator');

const helpers = require('./helpers');


async function main() {
    let answers = await inquirer.prompt([
        {
            type: 'number',
            name: 'numberOfVehicles',
            message: "How many vehicles would you like to create?",
            default: 5
        },
        // {
        //     type: 'number',
        //     name: 'numberOfDrones',
        //     message: "How many drones would you like to create?",
        //     default: 5
        // },
        // {
        //     type: 'number',
        //     name: 'numberOfOrders',
        //     message: "How many orders would you like to create?",
        //     default: 5
        // },
        {
            type: 'number',
            name: 'simulationTimeout',
            message: "For how long (in seconds) should the simulation run?",
            default: 10
        },
        {
            type: 'list',
            name: 'outputLog',
            message: "Would you like to output logging messages?",
            choices: [
                { name: 'No messages at all', value: 0, short: 'None' },
                { name: 'Only system messages', value: 1, short: 'System' },
                { name: 'All messages except published and received MQTT messages', value: 2, short: 'All except MQTT' },
                { name: 'All messages, including published and received MQTT messages', value: 3, short: 'All' },
            ],
            default: 3
        }
    ]);

    global.loggingLevel = answers.outputLog;
    helpers.logPlain(`Starting simulation...`);

    const vehicleSimulator = await new VehicleSimulator(answers.numberOfVehicles);
    // const droneSimulator = await new DroneSimulator(answers.numberOfDrones);
    // const orderSimulator = await new OrderSimulator(answers.numberOfOrders);

    setTimeout(() => {
        helpers.logPlain(`Ending simulation after ${answers.simulationTimeout} seconds.`);

        // End all open MQTT client connections
        vehicleSimulator.destructor();
        // droneSimulator.destructor();
        // orderSimulator.destructor();
    }, answers.simulationTimeout * 1000);
}

main();
