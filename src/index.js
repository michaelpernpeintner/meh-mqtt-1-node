// External modules
const inquirer = require('inquirer');

// Own modules
const VehicleSimulator = require('./vehicle-simulator/vehicle-simulator');

const helpers = require('./helpers');


async function main() {
    let answers = await inquirer.prompt([
        {
            type: 'number',
            name: 'numberOfVehicles',
            message: "How many vehicles would you like to create?",
            default: 5
        },
        {
            type: 'number',
            name: 'simulationTimeout',
            message: "For how long (in seconds) should the simulation run?",
            default: 10
        },
        {
            type: 'confirm',
            name: 'outputLog',
            message: "Would you like to output logging messages?",
            default: true
        }
    ]);

    helpers.logPlain(`Starting simulation...`);

    const vehicleSimulator = await new VehicleSimulator(answers.numberOfVehicles);

    setTimeout(() => {
        helpers.logPlain(`Ending simulation after ${answers.simulationTimeout} seconds.`);
        vehicleSimulator.destructor();
    }, answers.simulationTimeout * 1000);
}

main();
