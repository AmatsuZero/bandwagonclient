/*
* 添加依赖到文件
* require("babel-core/register");
* require("babel-polyfill");
* */

const fs = require('fs');

const path = './lib/index.js';
const data = fs.readFileSync(path).toString().split('\n');
data.splice(2, 0, 'require("babel-core/register");');
data.splice(3, 0, 'require("babel-polyfill");');

const text = data.join('\n');

fs.writeFile(path, text, (err) => {
  if (err) return console.log(err);
});
