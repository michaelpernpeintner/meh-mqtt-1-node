const readline = require('readline');
const inquirer = require('inquirer');
const { v4: createId } = require('uuid');

const helpers = require('./helpers');

let OptimizationEngine = require('./optimization-engine');
let Drone = require('./drone');
let CustomerSimulator = require('./customer-simulator');
let Vehicle = require('./vehicle');

// let oe = new OptimizationEngine({
//     'drone/state': (message) => {
//         if (message.position.y === 10) {
//             oe.publish('drone/move', { id: message.id, type: 'to', x: 0, y: 0 });
//         }
//     },
//     'order/received': (message) => {
//         console.log('order/received received');
//     }
// });

let drones = Array.from({ length: 5 }, () => new Drone());
let vehicles = Array.from({ length: 5 }, () => new Vehicle());

let cs = new CustomerSimulator('fixed', [
    // { name: 'Order 1', time: 5000, from: { x: 4, y: 5 }, to: { x: 0, y: 0 } },
    // { name: 'Order 2', time: 10000, from: { x: 2, y: 2 }, to: { x: 0, y: 10 } }
]);

// Global variables
// const inputHandler = readline.createInterface({ input: process.stdin, output: process.stdout });

async function moveDroneToOrigin() {
    try {
        let answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'drone',
                message: "Which drone would you like to move?",
                choices: drones.map(drone => drone.id)
            }
        ]);
        oe.publish('drone/move', { id: answer.drone, type: 'to', x: 0, y: 0 });
    }
    catch (error) {
        console.log('Error:', error.toString());
    }
}

async function moveDroneBy() {
    try {
        let answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: "Which drone would you like to move?",
                choices: drones.map(drone => drone.id)
            },
            { type: 'number', name: 'x', message: "What should be the x coordinate?" },
            { type: 'number', name: 'y', message: "What should be the y coordinate?" }
        ]);
        oe.publish('drone/move', { id: answer.id, type: 'to', x: answer.x, y: answer.y });
    }
    catch (error) {
        console.log('Error:', error.toString());
    }
}

async function makeOrder() {
    cs.makeOrder();
}

const actions = {
    moveDroneToOrigin: moveDroneToOrigin,
    moveDroneBy: moveDroneBy,
    makeOrder: makeOrder,
    shutDown: shutDown
};

async function mainLoop() {
    try {
        let answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: "Which action would you like to choose?",
                choices: Object.keys(actions)
            }
        ]);
        await actions[answer.action]();
        if (answer.action !== 'shutDown') {
            setTimeout(mainLoop, 500);
        }
    }
    catch (error) {
        console.log('Error:', error.toString());
    }
}

async function startUp() {
    console.log('Initializing...');
}

async function shutDown() {
    console.log('\nShutting down...');

    // oe.destructor();
    drones.forEach(el => el.destructor());
    vehicles.forEach(el => el.destructor());
    cs.destructor();
}

setTimeout(async () => {
    await startUp();
    await mainLoop();
}, 2000);

