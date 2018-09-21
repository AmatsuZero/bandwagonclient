const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const homeDir = require('os').homedir();
const {
  promisify,
} = require('util');
const chalk = require('chalk');

const dirPath = path.join(homeDir, 'Desktop', '.bandwagon');

// 获取pem文件路径
const createKey = async (name) => {
  const filePath = path.join(dirPath, `bandwagon-${name}-key.pem`);
  if (!fs.existsSync(filePath)) {
    console.log(chalk.blue.bold('正在创建PEM文件……'));
    if (shell.exec(`openssl genrsa -out ${filePath} 2048`).code !== 0) {
      throw new Error('创建PEM文件失败！！！');
    }
  }
  return filePath;
};

// 获取CSR文件路径
const createCSR = async (keyPath, name) => {
  const filePath = path.join(dirPath, `bandwagon-${name}-csr.pem`);
  if (!fs.existsSync(filePath)) {
    console.log(chalk.blue.bold('正在创建CSR文件……'));
    if (shell.exec(`openssl req -new -sha256 -key ${keyPath} -out ${filePath}`).code !== 0) {
      throw new Error('创建CSR文件失败！！！');
    }
  }
  return filePath;
};

// 获取自签证书路径
const creatSelfSignedCert = async (keyPath, csrPath, name) => {
  const filePath = path.join(dirPath, `bandwagon-${name}-cert.pem`);
  if (!fs.existsSync(filePath)) {
    console.log(chalk.blue.bold('正在创建Cert文件……'));
    if (shell.exec(`openssl x509 -req -in ${csrPath} -signkey ${keyPath} -out ${filePath}`).code !== 0) {
      throw new Error('创建Cert文件失败！！！');
    }
  }
  return filePath;
};

const createCertFiles = async (name) => {
  if (!fs.existsSync(dirPath)) {
    const mkdir = promisify(fs.mkdir);
    await mkdir(dirPath);
  }
  const keyPath = await createKey(name);
  const csrPath = await createCSR(keyPath, name);
  const certPath = await creatSelfSignedCert(keyPath, csrPath, name);
  return certPath;
};

export {
  createCertFiles,
};
