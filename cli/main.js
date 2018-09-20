const Bandwagon = require('bandwagonframework');
const inquirer = require('inquirer');
const chalk = require('chalk');
const keytar = require('keytar');
const figlet = require('figlet');
const {
  createCertFiles,
} = require('./src/connection');

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
  const serviceName = 'bandwagon';
  const answers = await inquirer.prompt([{
    name: 'account',
    type: 'input',
    message: '您的VPS名称是?',
  }]);
  const { account } = answers;
  const encryption = await keytar.getPassword('bandwagon', account);
  let api = null;
  if (!encryption) {
    const { veid, apiKey } = await inquirer.prompt([
      {
        name: 'veid',
        type: 'input',
        message: '请输入VEID：',
      },
      {
        name: 'apiKey',
        type: 'input',
        message: '请输入API KEY：',
      },
    ]);
    // 保存至Keychain
    try {
      await keytar.setPassword(serviceName, account, `${veid},${apiKey}`);
    } catch (e) {
      console.warn(`保存失败：${e.message}`);
    }
    api = new Bandwagon(veid, apiKey);
  } else {
    const [veid, apiKey] = encryption.split(',');
    api = new Bandwagon(veid, apiKey);
  }
  return { api, account };
};

const run = async () => {
  welcome();
  const { api, account } = await init();
  try {
    const status = await api.status();
    console.log(status.nodeIP);
    createCertFiles(account);
  } catch (e) {
    console.error(e.message);
  }
};

run();
