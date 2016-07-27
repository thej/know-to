# Install Linux on Dell XPS 13 (2015)

## Encrypting SSD

For detailled instructions, see [linux/encrypt_system_ssd.md](encrypt_system_ssd.md)

## Troubleshooting black screen after unlock from suspend

First, install xscreensaver and deinstall lightdm

```
pacman -Rs lightdm
pacman -Rs lightdm*
systemctl disable lightm
```

Install xscreensaver (for locking) and mdm as display manager:

```
pacman -S xscreensaver mdm
systemctl enable mdm.service -f
```

## Delete old and orphan packages

```
  sudo pacman -Sc
  sudo pacman -Rns $(pacman -Qqdt)
```

## Use fastest mirror for pacman

`sudo pacman-mirrors -g`

## Install newest Kernel

## Optimize power settings

see https://wiki.manjaro.org/index.php?title=Optimized_power_settings

## Install and configure conky

see https://forum.manjaro.org/index.php?topic=2991.0

## Firewall

Install ufw/gufw

see https://wiki.archlinux.org/index.php/Uncomplicated_Firewall

## Optimize performance

https://wiki.manjaro.org/index.php?title=Optimized_power_settings

## Install MS Fonts

Install ttf-ms-fonts and ttf-vista-fonts, this will not only make websites look more like on the Win7 office rig, but will also improve the looks of your imported Word docs a lot !

## Dynamically changing the scheduler I/O disks

The default I/O scheduler in Manjaro is BFQ . Higher read/write performance for the solid state drives have scheduler noop. You can automate the process of change scheduler disk I/O, depending on whether the disk is rotating (HDD) or not (SSD). Create a new file:

`sudo vim /etc/udev/rules.d/60-schedulers.rules`
  
Paste this code into it:

```
# set noop scheduler for non-rotating disks
ACTION=="add|change", KERNEL=="sd[a-z]", ATTR{queue/rotational}=="0", ATTR{queue/scheduler}="noop"
# set bfq scheduler for rotating disks
ACTION=="add|change", KERNEL=="sd[a-z]", ATTR{queue/rotational}=="1", ATTR{queue/scheduler}="bfq"
```

Save changes to a file. Restart the computer.

You can check current using scheduler for all connected disks by command:

`cat /sys/block/sd*/queue/scheduler`

## Sysctl settings

Edit _/etc/sysctl.d/100-manjaro.conf_:

```
vm.swappiness = 1
kernel.kptr_restrict = 1
kernel.sysrq = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.log_martians = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_timestamps = 0
```

## Troubleshooting

### Screen not locking on suspend

`sudo xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/logind-handle-lid-switch -s false`

 