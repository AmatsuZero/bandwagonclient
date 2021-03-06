const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const App = require('./src/app');

const welcome = () => {
  console.log(
    chalk.cyanBright(
      figlet.textSync('Bandwagon', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );
};

const init = async () => {
  const answers = await inquirer.prompt([{
    name: 'account',
    type: 'input',
    message: '您的VPS名称是?',
  }]);
  const { account } = answers;
  return new App(account);
};

const run = async () => {
  welcome();
  const app = await init();
  try {
    await app.init();
    console.log(await app.api.status());
    const ret = await app.executeScripts();
    console.log(ret);
  } catch (e) {
    console.error(e.message);
  }
};

run();
