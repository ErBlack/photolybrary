#!/usr/bin/env node

const commander = require('commander');
const rename = require('../lib/rename');

commander
    .version(require('../package').version)
    .usage('[options] <paths...>')
    .description('Rename images')
    .option('-d --dry-run [dryRun]', 'Log only', Boolean)
    .parse(process.argv);

if (commander.args) {
    rename(commander.args, commander.dryRun);
}
