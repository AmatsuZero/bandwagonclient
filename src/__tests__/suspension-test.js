import BandwagonClient from '../index';

const client = new BandwagonClient(process.env.veid, process.env.apiKey);

describe('停用相关', () => {
  test('获取停用信息', async () => {
    const ret = await client.getSuspensionDetails();
    expect(ret).not.toBeUndefined();
  });

  test('解除停用', async () => {
    const ret = client.getSuspensionDetails();
    const tasks = ret.suspensions
      .filter(info => info.isSoft)
      .map(info => client.unsuspend(info.recordId));
    Promise.all(tasks).then(value => expect(value).not.toBeUndefined());
  });
});
