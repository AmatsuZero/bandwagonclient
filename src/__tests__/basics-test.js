import BandwagonClient from '../index';

const client = new BandwagonClient(process.env.veid, process.env.apiKey);

describe('基础能力', () => {
  test('获取服务器信息', async () => {
    const info = await client.status();
    expect(info.tototalSize).not.toBeUndefined();
    expect(info.remainedSize).not.toBeUndefined();
  });

  test('获取VPS状态+信息', async () => {
    const liveInfo = await client.liveStatus();
    expect(liveInfo).not.toBeUndefined();
  });

  test('基础信息', async () => {
    const rawInfo = await client.rawUsage();
    expect(rawInfo).not.toBeUndefined();
  });

  test('可选系统', async () => {
    const systems = await client.availableOS();
    expect(systems).not.toBeUndefined();
  });

  test('执行命令', async () => {
    const ret = await client.exec('uname -v');
    expect(ret).not.toBeUndefined();
  });

  test('执行长命令', async () => {
    const script = `
   pushd /tmp
   ls -l
   popd
    `;
    const ret = await client.exec(script);
    expect(ret).not.toBeUndefined();
  });

  test('API 限制', async () => {
    const ret = await client.getRateLimitStatus();
    expect(ret).not.toBeUndefined();
  });
});
