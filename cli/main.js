const Bandwagon = require('bandwagonframework');
const inquirer = require('inquirer');
const chalk = require('chalk');
const keytar = require('keytar');
const figlet = require('figlet');

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync('Bandwagon', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );
};

const run = async () => {
  init();
};

run();
