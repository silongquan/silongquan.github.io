---
title:  Quantum Espresso Tutorial
date: 2026-06-22 16:30:00 +0800
categories: [Research]
tags: [QE, DFT, AIMD]
---

# Quantum Espresso 使用教程 ——by Silong Quan

## 1 登陆服务器 (如在本地计算可跳过此步)
- 下载安装[Xshell](https://cdn.netsarang.net/v8/Xshell-latest-p)和[Xftp](https://cdn.netsarang.net/v8/Xftp-latest-p)；
- 打开 Xshell，点击「新建」，点击「连接」填写主机地址、端口号等信息；再点击「用户身份验证」输入用户名与密码，完成后点击「确定」;
![主题](/assets/image/2026-06-22/1.png)

- 点击「打开」，选中刚刚新建的连接会话，点击「连接」登录服务器;
![主题](/assets/image/2026-06-22/2.png)

- 点击工具栏Xftp图标启动Xftp文件传输工具，窗口左侧为本地文件目录，右侧为服务器文件目录。
![主题](/assets/image/2026-06-22/3.png)


## 2 新建个人文件夹和工作目录
登陆服务器后，先新建自己的`个人文件夹`，以后所有的操作和计算在新建的个人文件夹中进行，如我以自己的姓名拼音新建个人文件夹「quansilong/」。新建个人文件夹后，进入`个人文件夹`（如「quansilong/」）. 
```bash
msmcquan@inspur-NF5468M5:~$ mkdir quansilong
msmcquan@inspur-NF5468M5:~$ ll
total 4
drwxr-xr-x 3 msmcquan quansilong 4096 6月  15 10:39 quansilong/
msmcquan@inspur-NF5468M5:~$ cd quansilong/
msmcquan@inspur-NF5468M5:~/quansilong$ pwd
/home/msmcquan/quansilong
```

在`个人文件夹`（如「quansilong/」）中新建`工作目录`（如「LiFePO4-c-010-QE/」），并进入`工作目录「LiFePO4-c-010-QE/`。此教程将以计算 $LiFePO_4$的电子结构为例。
```bash
msmcquan@inspur-NF5468M5:~/quansilong$ mkdir LiFePO4-c-010-QE
msmcquan@inspur-NF5468M5:~/quansilong$ cd LiFePO4-c-010-QE/
msmcquan@inspur-NF5468M5:~/quansilong/LiFePO4-c-010-QE$ pwd
/home/msmcquan/quansilong/LiFePO4-c-010-QE
```


## 3 准备PBS队列系统提交脚本
`PBS（Protable Batch System）`是功能最为齐全，历史最悠久，支持最广泛的本地集群调度器之一。 PBS的目前包括OpenPBS，PBS Pro和Torque三个主要分支。其中OpenPBS是最早的PBS系统，目前已经没有太多后续开发，PBS pro是PBS的商业版本，功能最为丰富。`Torque`是Clustering公司接过了OpenPBS，并给与后续支持的一个开源版本。

`Torque`作为一款开源免费的PBS排队管理系统，被许多使用服务器和集群的小组广泛使用。课题组服务器上已经部署好 `Torque PBS`任务排队管理系统。PBS队列系统提交脚本 `runqe-pw.pbs`我已写好，已上传到我的个人文件夹中。
```bash
msmcquan@inspur-NF5468M5:~/quansilong/LiFePO4-c-010-QE$ ll ..
total 12
drwxr-xr-x 2 msmcquan quansilong 4096 6月  24 09:39 LiFePO4-c-010-2x1x2-vac-QE/
drwxr-xr-x 2 msmcquan quansilong 4096 6月  24 09:40 LiFePO4-c-010-QE/
-rw-r--r-- 1 msmcquan quansilong  889 6月  24 15:20 runqe-pw.pbs
```

计算时，需要将PBS队列系统提交脚本 `runqe-pw.pbs`复制到自己计算的工作目录。如本教程中，需要将PBS队列系统提交脚本 `runqe-pw.pbs`复制到工作目录 `LiFePO4-c-010-QE/`中。
```bash
msmcquan@inspur-NF5468M5:~/quansilong/LiFePO4-c-010-QE$ cp ../runqe-pw.pbs .
msmcquan@inspur-NF5468M5:~/quansilong/LiFePO4-c-010-QE$ ll
total 4.0K
-rw-r--r-- 1 msmcquan quansilong 889 6月  24 16:10 runqe-pw.pbs
```


## 4 Quantum ESPRESSO计算
### 4.1 Quantum ESPRESSO介绍
`Quantum ESPRESSO`是一个开源的电子结构计算和材料模拟软件，它主要是基于密度泛函理论(DFT)，平面波和赝势理论，它的功能主要包括：
- 基态计算
  - 能量自洽，应力，Kohn—Sham轨道
  - 支持模守恒赝势(NCPP)和超软赝势(USPP)，缀加投影波(PAW)
  - 包含多种交换-关联泛函：从LDA到GGA(PW91, PBE, B88-P86, BLYP)再到meta-GGA, 再到精确交换(HF)和杂化泛函(PBE0, B3LYP, HSE)
  - 范德华修正：Grimme的D2,D3修正，XDM, 非局域范德华泛函
  - Hubbard U(DFT+U, DFT+U+V)
  - Berry相位极化
  - 非线性磁矩，自旋轨道耦合
- 结构优化，分子动力学和势能面
	- 准牛顿BFGS预处理的几何优化(GDIIS)
	- 阻尼动力学
	- Car-Parrinello分子动力学
	- 波恩-奥本海默分子动力学
	- 轻推弹性带(NEB)方法
- 量子输运
	- 弹道输运
	- 基于最大局域万尼尔函数(MLWF)的相干传输
	- 最大局域化万尼尔函数(MLWF)和输运性质
	- Kubo-Greenwood电导
- 电化学和特殊边界条件…
- 响应性质(微扰密度泛函理论)…
- 光谱性质...

值得一提的是，QE在电声相互作用、弛豫时间计算等方面做的非常好。截至目前，QE的最新版本7.5版本。

`Quantum ESPRESSO`是一套集成的开源软件套件，包含很多功能独立的程序模块，如常用的 `pw.x`, `bands.x`, `dos.x`, `cp.x`, `pp.x`, `neb.x`等。
```bash
quansilong@inspur-NF5468M5:~/soft/qe-7.5/bin$ pwd
/home/quansilong/soft/qe-7.5/bin
quansilong@inspur-NF5468M5:~/soft/qe-7.5/bin$ ls
alpha2f.x             disca.x         fermi_proj.x      kcwpp_interp.x  molecularnexafs.x     pioud.x     pprism.x        pwi2xsf.x             sumpdos.x         wfck2r.x
average.x             dist.x          fermi_velocity.x  kcwpp_sh.x      molecularpdos.x       plan_avg.x  pp_spctrlfn.x   pw.x                  turbo_davidson.x  wfdd.x
band_interpolation.x  dos.x           fqha.x            kcw.x           neb.x                 plotband.x  pp.x            q2qstar.x             turbo_eels.x      xspectra.x
bands_unfold.x        dvscf_q2r.x     fs.x              kpoints.x       nscf2supercond.x      plotproj.x  projwfc.x       q2r.x                 turbo_lanczos.x   ZG.x
bands.x               dynmat.x        gww_fit.x         lambda.x        open_grid.x           plotrho.x   pw2bgw.x        rism1d.x              turbo_magnon.x
bse_main.x            epa.x           gww.x             ld1.x           oscdft_et.x           pmw.x       pw2critic.x     scan_ibrav.x          turbo_spectrum.x
cell2ibrav.x          epsilon_Gaus.x  head.x            manycp.x        oscdft_pp.x           postahc.x   pw2gw.x         simple_bse.x          wannier2pw.x
cppp.x                epsilon.x       hp.x              manypw.x        path_interpolation.x  postw90.x   pw2wannier90.x  simple_ip.x           wannier90.x
cp.x                  epw.x           ibrav2cell.x      matdyn.x        phcg.x                ppacf.x     pw4gww.x        simple.x              wannier_ham.x
d3hess.x              ev.x            initial_state.x   merge_wann.x    ph.x                  pp_disca.x  pwcond.x        spectra_correction.x  wannier_plot.x
```


### 4.2 Quantum ESPRESSO输入文件及赝势
#### 4.2.1 Quantum ESPRESSO输入文件
- `pw.x`输入文件结构如下，具体参考 `pw.x`手册（[https://www.quantum-espresso.org/Doc/INPUT_PW.html](https://www.quantum-espresso.org/Doc/INPUT_PW.html)）：

```
Input data format: { } = optional, [ ] = it depends, | = or

All quantities whose dimensions are not explicitly specified are in
RYDBERG ATOMIC UNITS. Charge is "number" charge (i.e. not multiplied
by e); potentials are in energy units (i.e. they are multiplied by e).

BEWARE: TABS, CRLF, ANY OTHER STRANGE CHARACTER, ARE A SOURCES OF TROUBLE
USE ONLY PLAIN ASCII TEXT FILES (CHECK THE FILE TYPE WITH UNIX COMMAND "file")

Namelists must appear in the order given below.
Comment lines in namelists can be introduced by a "!", exactly as in
fortran code. Comments lines in cards can be introduced by
either a "!" or a "#" character in the first position of a line.
Do not start any line in cards with a "/" character.
Leave a space between card names and card options, e.g.
ATOMIC_POSITIONS (bohr), not ATOMIC_POSITIONS(bohr)


Structure of the input data:
===============================================================================

&CONTROL
  ...
/

&SYSTEM
  ...
/

&ELECTRONS
  ...
/

[ &IONS
  ...
 / ]

[ &CELL
  ...
 / ]

[ &FCP
  ...
 / ]

[ &RISM
  ...
 / ]

ATOMIC_SPECIES
 X  Mass_X  PseudoPot_X
 Y  Mass_Y  PseudoPot_Y
 Z  Mass_Z  PseudoPot_Z

ATOMIC_POSITIONS { alat | bohr | angstrom | crystal | crystal_sg }
  X 0.0  0.0  0.0  {if_pos(1) if_pos(2) if_pos(3)}
  Y 0.5  0.0  0.0
  Z 0.0  0.2  0.2

K_POINTS { tpiba | automatic | crystal | gamma | tpiba_b | crystal_b | tpiba_c | crystal_c }
if (gamma)
   nothing to read
if (automatic)
   nk1, nk2, nk3, k1, k2, k3
if (not automatic)
   nks
   xk_x, xk_y, xk_z,  wk
if (tpipa_b or crystal_b in a 'bands' calculation) see Doc/brillouin_zones.pdf

[ CELL_PARAMETERS { alat | bohr | angstrom }
   v1(1) v1(2) v1(3)
   v2(1) v2(2) v2(3)
   v3(1) v3(2) v3(3) ]

[ OCCUPATIONS
   f_inp1(1)  f_inp1(2)  f_inp1(3) ... f_inp1(10)
   f_inp1(11) f_inp1(12) ... f_inp1(nbnd)
 [ f_inp2(1)  f_inp2(2)  f_inp2(3) ... f_inp2(10)
   f_inp2(11) f_inp2(12) ... f_inp2(nbnd) ] ]

[ CONSTRAINTS
   nconstr  { constr_tol }
   constr_type(.)   constr(1,.)   constr(2,.) [ constr(3,.)   constr(4,.) ] { constr_target(.) } ]

[ ATOMIC_VELOCITIES
   label(1)  vx(1) vy(1) vz(1)
   .....
   label(n)  vx(n) vy(n) vz(n) ]

[ ATOMIC_FORCES
   label(1)  Fx(1) Fy(1) Fz(1)
   .....
   label(n)  Fx(n) Fy(n) Fz(n) ]

[ ADDITIONAL_K_POINTS
     see: K_POINTS ]

[ SOLVENTS
   label(1)     Density(1)     Molecule(1)
   label(2)     Density(2)     Molecule(2)
   .....
   label(nsolv) Density(nsolv) Molecule(nsolv) ]

[ HUBBARD { atomic | ortho-atomic | norm-atomic | wf | pseudo }
  if (DFT+U)
      U     label(1)-manifold(1) u_val(1)
    [ J0    label(1)-manifold(1) j0_val(1) ]
    [ ALPHA label(1)-manifold(1) alpha_val(1) ]
      .....
      U     label(n)-manifold(n) u_val(n)
    [ J0    label(n)-manifold(n) j0_val(n) ]
    [ ALPHA label(n)-manifold(n) alpha_val(n) ]
  if (DFT+U+J)
      paramType(1) label(1)-manifold(1) paramValue(1)
      .....
      paramType(n) label(n)-manifold(n) paramValue(n)
  if (DFT+U+V)
      U  label(I)-manifold(I) u_val(I)
    [ J0 label(I)-manifold(I) j0_val(I) ]
      V  label(I)-manifold(I) label(J)-manifold(J) I J v_val(I,J)
      .....
      U  label(N)-manifold(N) u_val(N)
    [ J0 label(N)-manifold(N) j0_val(N) ]
      V  label(N)-manifold(N) label(M)-manifold(M) N M v_val(N,M)
  if (DFT+U (orbital-resolved))
      U     label(1)-shell(1) u_val(1)      eigenstate(1) [... eigenstate(4l+2)]
    [ ALPHA label(1)-shell(1) alpha_val(1)  eigenstate(1) [... eigenstate(4l+2)]  ]
      .....
      U     label(n)-shell(n) u_val(n)      eigenstate(n) [... eigenstate(4l+2)]
    [ ALPHA label(n)-shell(n) alpha_val(n)  eigenstate(n) [... eigenstate(4l+2)]  ]
All Hubbard parameters must be specified in eV.
manifold  = 3d, 2p, 4f...
shell  = 3d, 2p, 4f...
paramType = U, J, B, E2, or E3
eigenstate = 1, 2, 3, ..., 10 (d-shell)
Check Doc/Hubbard_input.pdf for more details. ]
```

`pw.x`的输入文件可以借助[`Quantum ESPRESSO input generator and structure visualizer`](https://qeinputgenerator.materialscloud.io/)和[QEtoolkit](https://www.densityflow.com/)中[`cif转为pw.x输入文件`](https://www.densityflow.com/cif2qe.php)在线产生，然后根据需要进行稍微修改。例如， $LiFePO_4$ (变胞)结构优化的输入文件如下：
```
 &CONTROL
   calculation     = 'vc-relax'
   restart_mode    = 'from_scratch'
   outdir          = './tmp'
   pseudo_dir      = './'
   prefix          = 'LiFePO4-c-010'
   verbosity       = 'low'
   etot_conv_thr   = 5.D-5
   forc_conv_thr   = 1.D-4
   nstep           = 200
 /
 &SYSTEM
   ibrav           = 0
   nat             = 28
   ntyp            = 4
   ecutwfc         = 90.0
   ecutrho         = 1080.0
   occupations     = 'smearing'
   degauss         = 0.005
   smearing        = 'gaussian'
   vdw_corr        = 'grimme-d3'
   dftd3_version   = 3
 /
 &ELECTRONS
   electron_maxstep = 128
   conv_thr        = 1.D-8
   mixing_mode     = 'plain'
   mixing_beta     = 0.7
   mixing_ndim     = 8
   diagonalization = 'david'
 /
 &IONS
   ion_dynamics    = 'bfgs'
 /
 &CELL
   cell_dynamics   = 'bfgs'
   press           = 0
   press_conv_thr  = 0.1
 /
 CELL_PARAMETERS angstrom
     4.746400000    0.000000000    0.000000000
     0.000000000    10.443700000    0.000000000
     0.000000000    0.000000000    6.090200000
 ATOMIC_SPECIES
   Fe 	55.845 	Fe.pbe-spn-kjpaw_psl.0.2.1.UPF
   Li 	6.94 	li_pbe_v1.4.uspp.F.UPF
   O 	15.999 	O.pbe-n-kjpaw_psl.0.1.UPF
   P 	30.974 	P.pbe-n-rrkjus_psl.1.0.0.UPF
 ATOMIC_POSITIONS crystal
  Li  0.5000000000  0.0000000000  0.0000000000
  Li  0.0000000000  0.5000000000  0.0000000000
   O  0.2154900000  0.8345100000  0.0470000000
   O  0.2845100000  0.3345100000  0.0470000000
   O  0.2069500000  0.0429300000  0.2500000000
   O  0.7581300000  0.9032800000  0.2500000000
   O  0.2930500000  0.5429300000  0.2500000000
  Fe  0.9752500000  0.2180200000  0.2500000000
  Fe  0.5247500000  0.7180200000  0.2500000000
   O  0.7418700000  0.4032800000  0.2500000000
   P  0.4178200000  0.4052500000  0.2500000000
   P  0.0821800000  0.9052500000  0.2500000000
   O  0.2845100000  0.3345100000  0.4530000000
   O  0.2154900000  0.8345100000  0.4530000000
  Li  0.5000000000  0.0000000000  0.5000000000
  Li  0.0000000000  0.5000000000  0.5000000000
   O  0.7845100000  0.1654900000  0.5470000000
   O  0.7154900000  0.6654900000  0.5470000000
  Fe  0.0247500000  0.7819800000  0.7500000000
   O  0.7069500000  0.4570700000  0.7500000000
   O  0.2581300000  0.5967200000  0.7500000000
   P  0.5821800000  0.5947500000  0.7500000000
  Fe  0.4752500000  0.2819800000  0.7500000000
   O  0.2418700000  0.0967200000  0.7500000000
   P  0.9178200000  0.0947500000  0.7500000000
   O  0.7930500000  0.9570700000  0.7500000000
   O  0.7845100000  0.1654900000  0.9530000000
   O  0.7154900000  0.6654900000  0.9530000000
 K_POINTS automatic
 5 2 4 0 0 0
```


- `bands.x`输入文件结构如下，具体参考 `bands.x`手册([https://www.quantum-espresso.org/Doc/INPUT_BANDS.html](https://www.quantum-espresso.org/Doc/INPUT_BANDS.html)):

```
Purpose of bands.x:
   Re-order bands, computes band-related properties. Currently,
   re-ordering can be done with two different algorithms:
   (a) by maximising the overlap with bands at previous k-point
   (b) by computing symmetry properties of each wavefunction
   Bands-related properties that can be computed are currently
   (a) The expectation value of the spin operator on each spinor
       wave-function (noncolinear case only)
   (b) The expectation value of p

The input data can be read from standard input or from file using
command-line options "bands.x -i file-name" (same syntax as for pw.x)

Output files:
- file filband containing the band structure, in a format
  suitable for plotting code "plotband.x"
- file "filband".rap (if lsym is .t.)  with symmetry information,
  to be read by plotting code "plotband.x"
- if (lsigma(i)): file "filband".i, i=1,2,3, with expectation values
  of the spin operator in the noncolinear case
- file "filband".gnu with bands in eV, directly plottable using gnuplot
- file filp with matrix elements of p (including the nonlocal potential
  contribution i*m*[V_nl,x])

Structure of the input data:
============================

   &BANDS
     ...
   /
```


#### 4.2.2 Quantum ESPRESSO赝势
Quantum ESPRESSO目前支持PAW (Projector-Augmented Wave) sets, Ultrasoft (US) pseudopotentials (PPs) and Norm-Conserving (NC) PPs in separable (Kleinman-Bylander) form. Some calculations (e.g. meta-GGA functionals, Gamma-only phonon, third-order energy derivatives: Raman, anharmonic force constants) work only with NC PPs; CP does not yet support PAW.

An excellent resource for PPs is Standard Solid State PPs ([SSSP](https://legacy.materialscloud.org/discover/sssp/table/efficiency)), a collection of the best verified PPs, maintained by THEOS and MARVEL on the [Materials Cloud](https://www.materialscloud.org/).（**建议采用**）

Ready-to-use PP tables are available [here](https://pseudopotentials.quantum-espresso.org/legacy_tables). 

### 4.3 Quantum ESPRESSO计算流程



<font size="4" color="red"><b>这是红色加粗的大号字体</b></font>
