import BandwagonClient from '../index';

const client = new BandwagonClient(process.env.veid, process.env.apiKey);

describe('快照相关', () => {
  test('创建快照', async () => {
    const email = await client.createSnapshot('Test');
    expect(email).toMatch(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
  });

  test('快照列表', async () => {
    const list = await client.snapshotList();
    expect(list).not.toBeUndefined();
  });

  // test('导出快照', async () => {
  //   const list = await client.snapshotList();
  //   const tasks = list.map(snapshot => client.exportSnapshot(snapshot.fileName));
  //   Promise.all(tasks).then(value => expect(value).not.toBeUndefined());
  // });

  test('删除快照', async () => {
    const list = await client.snapshotList();
    const tasks = list.map(snapshot => client.deleteSnapshot(snapshot.fileName));
    Promise.all(tasks).then(value => expect(value).not.toBeUndefined());
  });
});
