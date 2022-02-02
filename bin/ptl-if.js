#!/usr/bin/env node

const commander = require('commander');
const instafuck = require('../lib/instafuck');

commander
    .version(require('../package').version)
    .usage('[options] <paths...>')
    .description('Fuck instagram')
    .option('-d --dry-run [dryRun]', 'Log only', Boolean)
    .parse(process.argv);

if (commander.args[0]) {
    instafuck(commander.args, commander.dryRun);
}
