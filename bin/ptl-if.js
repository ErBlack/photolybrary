#!/usr/bin/env node

const commander = require('commander');
const rename = require('../lib/instafuck');

commander
    .version(require('../package').version)
    .usage('[options] <pattern>')
    .description('Fuck instagram')
    .option('-d --dry-run [dryRun]', 'Log only', Boolean)
    .parse(process.argv);

if (commander.args[0]) {
    rename(commander.args[0], commander.dryRun);
}