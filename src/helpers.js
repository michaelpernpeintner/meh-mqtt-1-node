module.exports = {
    logPlain: (message) => { console.log(`  ${message}`); },
    logPublish: (sender, topic, message) => { console.log(`\x1b[90mi \x1b[37m${sender.toString()} \x1b[90mpublishes "${JSON.stringify(message)}" on topic "${topic}".\x1b[0m`); },
    logReceive: (sender, topic, message) => { console.log(`\x1b[90mi \x1b[37m${sender.toString()} \x1b[90mreceives ${JSON.stringify(message)} on topic "${topic}".\x1b[0m`); },
    logError: (message) => { console.log('\x1b[31mi ', message, '\x1b[0m'); }
};
