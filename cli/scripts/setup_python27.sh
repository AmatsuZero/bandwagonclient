sudo yum update # update yum
sudo yum install centos-release-scl # install SCL
sudo yum install python27 # install Python 2.7

scl enable python27 bash

cd /opt/rh/python27/root/usr/bin/ # cd to the directory where SCL installs python
sudo LD_LIBRARY_PATH=$LD_LIBRARY_PATH ./easy_install-2.7
pip

sudo LD_LIBRARY_PATH=$LD_LIBRARY_PATH ./pip2.7 install requests