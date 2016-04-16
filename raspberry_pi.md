# Setup Raspberry Pi as Server 


## Change keyboard layout
```
dpkg-reconfigure keyboard-configuration
```

## Get WiFi working

```
wpa_passphrase <essid> <passphrase> >> /etc/wpa_supplicant/wpa_supplicant.conf
reboot
```

## SSH Server

- Add authorized_keys

## Resize root partition

```
fdisk /dev/mmcblk0p2
p     # wirte doen first block of root partition
d 2   # delete root partition
n     # recreate root partition with old start sector
reboot
resize2fs /dev/mmcblk0p2
```


## Software installation

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
reboot
sudo apt-get install screen vim rpi-update
```


## Change hostname

Edit in */etc/hostname* and */etc/hosts*:


## Partitions and fstab

Partitions on external HD:

```
Mountpoint  Device     Boot      Start        End   Sectors   Size Id Type
/home       /dev/sda1             2048  976564223 976562176 465.7G 83 Linux
/var        /dev/sda2        976564224 1605709823 629145600   300G 83 Linux
/tmp        /dev/sda3       1605709824 1739927551 134217728    64G 83 Linux
extended    /dev/sda4       1739927552 1953525167 213597616 101.9G  5 Extended
swap        /dev/sda5       1739929600 1778991103  39061504  18.6G 82 Linux swap / Solaris
/srv        /dev/sda6       1778993152 1953525167 174532016  83.2G 83 Linux
```

Format disks:

```
mkfs.ext4 -L home /dev/sda1 
mkfs.ext4 -L var /dev/sda2
mkfs.ext4 -L tmp /dev/sda3
mkfs.ext4 -L srv /dev/sda6
mkswap /dev/sda5 
mkswap -L swap /dev/sda5 
```

Mount disks:

```
mkdir -p /mnt/tmp/home
mkdir -p /mnt/tmp/var
mkdir -p /mnt/tmp/tmp
mkdir -p /mnt/tmp/srv
mount /dev/sda1 /mnt/tmp/home
mount /dev/sda2 /mnt/tmp/var
mount /dev/sda3 /mnt/tmp/tmp
mount /dev/sda6 /mnt/tmp/srv
```

Copy content of existing partitions to external HD:

```
cp -afv /home/* /mnt/tmp/home
cp -afv /var/* /mnt/tmp/var
cp -afv /tmp/* /mnt/tmp/tmp
cp -afv /srv/* /mnt/tmp/srv
```

Add new partitions to */etc/fstab*:

```
/dev/sda1       /home           ext4    defaults,noatime  0       1
/dev/sda2       /var            ext4    defaults,noatime  0       1
/dev/sda3       /tmp            ext4    defaults,noatime  0       1
/dev/sda6       /srv            ext4    defaults,noatime  0       1
```

Reboot.


## Firewall


## TCP/IP Stack Hardening
