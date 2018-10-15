const path = require('path');
const fs = require('fs');

const dict = new Map([
  ['设置代理服务器', 'proxy'],
  ['测试', 'test'],
]);

module.exports = async (types, server) => {
  const commands = types
    .filter(type => dict.has(type))
    .map(type => `setup_${dict.get(type)}.sh`)
    .map(type => fs.readFileSync(path.join(__dirname, type)))
    .map(script => server.exec(script));
  if (commands.length <= 0) {
    throw new Error(`未知的命令: ${types}`);
  }
  return Promise.all(commands);
};
