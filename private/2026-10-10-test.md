---
title:  Quantum Espresso 编译安装
date: 2026-07-15 10:00:00 +0800
categories: [Research]
tags: [QE, DFT, AIMD]
---

# Quantum Espresso 编译安装教程（Ubuntu） ——by Silong Quan

## 安装环境搭建

- 安装 gfortran：sudo apt install gfortran
- 安装 git：sudo apt install git
- 安装 make：sudo apt install make
- 有可能还需要安装一些其他的环境（如果编译过程有报错，可以试着安装解决）：apt install cmake libopenmpi-dev libfftw3-dev libblas-dev liblapack-dev libhdf5-dev


## Quantum Espresso 源码下载及解压

进入Quantum ESPRESSO官网下载[Quantum ESPRESSO v7.5](https://www.quantum-espresso.org/rdm-download/8/v7-5/d1694000b945ef50cef0e7dd471373ff/qe-7.5-ReleasePack.tar.gz)。

## Quantum Espresso 编译安装

- 仅串行编译（可以直接使用后面的 MPICH 并行编译）：

  配置：./configure，提示配置成功  
  编译所有：make all （仅编译pw：make pw）    

- 使用 MPICH 或者opemmpi并行编译：

  (1) 提前安装好MPICH：sudo apt install mpich  
  测试：mpif90 -v  
  
  (2) 之前如果有串行编译过，则需要清除编译文件，仅保留源文件，命令为：
  ```bash
  make clean
  ```
  配置：
  ```bash
  ./configure
  ```
  或
  ```bash
  ./configure -enable-parallel
  ```
  最后提示配置成功即可。
  
  (3) 编译  
  编译所有子程序：
  ```bash
  make all
  ```
  仅编译pw：
  ```bash
  make pw
  ```
  需编译epw，执行：
  ```bash
  make epw
  ```
   
  编译wannier90报错，可能是wannier90第三方安装包无法下载或者下载不完全，解决方法：  
  可本地手动下载wannier90源码，然后改名为 `v3.1.0`并上传到Quantum ESPRESSO根目录下 `archive/`目录下，再重新编译！
  ```bash
  msmcquan@inspur-NF5468M5:/home/quansilong/soft/qe-7.5/archive$ pwd
  /home/quansilong/soft/qe-7.5/archive
  msmcquan@inspur-NF5468M5:/home/quansilong/soft/qe-7.5/archive$ ll
  total 97M
  -rw-r--r-- 1 quansilong quansilong 184 9月   3  2025 README.md
  -rw-rw-r-- 1 quansilong quansilong 97M 12月 25  2025 v3.1.0
  ```
  
  (4) 添加环境变量：  
  1) 方法一（推荐）：编辑 ~/.bashrc 文件，添加内容：
  ```shell
  export PATH=$PATH:/home/quansilong/soft/qe-7.5/bin
  ```
  保存后输入命令更新：
  ```shell
  source ~/.bashrc
  ```
  2) 方法二：编辑 /etc/environment 文件，在最后的引号前添加对应的路径，系统重启。
  
  (5) 测试（**可选，非必须**）  
  进入文件夹：cd test-suite/  
  串行测试：make run-tests-pw-serial（中途可 Ctrl+C 中断）  
  并行测试：make run-tests-pw-parallel（中途可 Ctrl+C 中断）  
  串行运行：pw.x < test.in > test.out  
  并行运行：mpirun -np 4 pw.x < test.in > test.out  
  
  (6) 说明  
  特别说明：make 编译的时间可能会有点长，可能会超过一个小时，需要耐心等待。可以通过命令放置于后台运行：nohup make all & 。使用 ps -ef|grep make\ all 命令查看是否编译完成，或者查看 nohup.out 文件来判断。  
  
  补充说明：如果安装了 gfortran，但 mpif90 -v 和 ./configure 时仍然找不到 gfortran，这可能是由于安装了 anaconda 的原因，conda 环境中的 gfortran 抢占了 sudo apt 安装的 gfortran，但版本好像不对，导致报错。目前个人的解决方案是：将 ~/.bashrc 中的 conda 环境变量注释后（类似于卸载anaconda），再继续安装 Quantum Espresso。安装完后再把 conda 的环境变量恢复。

## 运行命令示例

- 前台运行

  串行运行：
  ```bash
  pw.x < xx.scf.in > xx.scf.out
  ```
  并行运行：
  ```bash
  mpirun -np 4 pw.x < xx.scf.in > xx.scf.out
  ```

- 后台运行

  串行运行：
  ```bash
  nohup pw.x < xx.scf.in > xx.scf.out &
  ```
  并行运行：
  ```bash
  nohup mpirun -np 4 pw.x < xx.scf.in > xx.scf.out &
  ```

- 队列脚本提交

  ```bash
  qsub runqe-pw.pbs 
  ```
  队列提交脚本 `runqe-pw.pbs`一般服务器管理员会写好,并提供给用户! 


## 参考资料
1. [https://www.quantum-espresso.org/](https://www.quantum-espresso.org/)
2. [Quantum Espresso的安装](https://www.guanjihuan.com/archives/12325)
