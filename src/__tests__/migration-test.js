import BandwagonClient from '../index';

const client = new BandwagonClient(process.env.veid, process.env.apiKey);

describe('迁移相关', () => {
  test('获取迁移信息', async () => {
    const ret = await client.getMigrateLocations();
    expect(ret).not.toBeUndefined();
  });
});
