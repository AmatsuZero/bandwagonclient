const Bandwagon = require('bandwagonframework');
const inquirer = require('inquirer');
const chalk = require('chalk');
const keytar = require('keytar');
const SSH = require('./ssh');
const commands = require('../scripts');

const serviceName = 'bandwagon';

module.exports = class App {
  constructor(account) {
    this.account = account;
    this.api = null;
    this.status = null;
    this.sshClient = null;
  }

  async init() {
    if (this.api !== null) {
      throw Error('已经初始化！！！');
    }
    const encryption = await keytar.getPassword(serviceName, this.account);
    if (!encryption) {
      const { veid, apiKey } = await App.askInfo();
      // 保存至Keychain
      try {
        await this.replace(veid, apiKey);
      } catch (e) {
        console.warn(chalk.red.bold(`保存失败：${e.message}`));
      }
      this.api = new Bandwagon(veid, apiKey);
    } else {
      const [veid, apiKey] = encryption.split(',');
      this.api = new Bandwagon(veid, apiKey);
    }
    this.status = await this.api.status();
    this.sshClient = new SSH(this.status.nodeIP);
  }

  async replace(veid, apiKey) {
    await keytar.setPassword(serviceName, this.account, `${veid},${apiKey}`);
  }

  async sshConnect(name = 'root') {
    await this.sshClient.connect(name);
  }

  async executeScripts() {
    const name = 'commands';
    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        message: '选择要执行的命令',
        name,
        choices: [
          {
            name: '测试',
          },
          {
            name: '设置代理服务器',
          },
        ],
        validate: (answer) => {
          if (answer.length < 1) {
            return '至少选择一种命令';
          }
          return true;
        },
      },
    ]);
    return commands(answers[name], this.api);
  }

  static askInfo() {
    return inquirer.prompt([
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
  }
};
