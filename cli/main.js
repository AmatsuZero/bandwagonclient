const Bandwagon = require('bandwagonframework');
const commander = require('commander');

const api = new Bandwagon(1109682, 'private_XhGNpvzWcZZCcvXX3tPITk2J');

const test = async () => {
  const ret = await api.status();
  console.log(ret);
};

test();
