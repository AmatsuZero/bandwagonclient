# 切回到临时目录
pushd /tmp
# 安装下载源码
git clone https://github.com/rofl0r/proxychains-ng
# 安装
pushd proxychains-ng
./configure --prefix=/usr --sysconfdir=/etc
make
make install
make install-config
# 安装完毕后删除
popd && rm -rf proxychains-ng
# 切回到原来的目录
popd