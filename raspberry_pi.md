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


## Partitions and fstab

## Firewall

