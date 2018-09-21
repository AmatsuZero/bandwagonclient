const { Client } = require('ssh2');
const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');
const keytar = require('keytar');
const shell = require('shelljs');

const serviceName = 'bandwagon-ssh';

module.exports = class SSH {
  constructor(host) {
    this.client = new Client();
    this.host = host;
  }

  async connect(username) {
    const config = { username };
    const encryption = await keytar.getPassword(serviceName, `${this.host}`);
    if (encryption !== null) {
      const [port, privateKeyPath] = encryption.split(',');
      config.port = port;
      config.privateKeyPath = fs.realpathSync(privateKeyPath);
    } else {
      const { port, privateKeyPath } = await inquirer.prompt([
        {
          name: 'port',
          type: 'input',
          message: '请输入端口号：',
        },
        {
          name: 'privateKeyPath',
          type: 'input',
          message: '请输入私钥路径：',
        },
      ]);
      config.port = port;
      config.privateKeyPath = fs.realpathSync(privateKeyPath);
      try {
        await this.replace(port, privateKeyPath);
      } catch (e) {
        console.log(chalk.red.bold('保存失败！！！'));
      }
    }
    this.client.on('ready', this.ready);
    this.client.connect(config);
    if (!this.copyToServer(username, config.port)) {
      throw new Error('拷贝失败！！！');
    }
  }

  async replace(port, privateKey) {
    await keytar.setPassword(serviceName, `${this.host}`, `${port},${privateKey}`);
  }

  ready() {
    console.log(chalk.green('Client :: ready'));
    this.client.exec('uptime', (err, stream) => {
      if (err) throw err;
      stream.on('close', this.streamCloseEvent);
      stream.on('data', this.streamDataEvent);
      stream.stderr.on('data', this.streamStdErrorDataEvent);
    });
  }

  copyToServer(userName, port) {
    return shell.exec(`ssh-copy-id ${userName}@${this.host} -p ${port}`).code === 0;
  }

  streamCloseEvent(code, signal) {
    console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);
    this.client.end();
  }

  streamDataEvent(data) {
    console.log(`STDOUT: ${data}`);
  }

  streamStdErrorDataEvent(data) {
    console.log(`STDERR: ${data}`);
  }
};
