#!/usr/bin/env node

const commander = require('commander');
const pkg = require('../package');

commander
    .version(pkg.version)
    .command('rename', 'Rename images')
    .command('if', 'Rename images');

commander.parse(process.argv);