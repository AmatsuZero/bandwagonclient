const {
  createPEM,
} = require('../src/ssl');

describe('SSH链接', () => {
  test('创建PEM文件', async () => {
    const path = await createPEM('da');
    expect(path).not.toBeUndefined();
  });
});
