# Encrypt SSD with LUKS and LVM

## IMPORTANT NOTES

Some important notes to consider before encryption.

### Use hdparm instead of BIOS password for hardware self-encryption

Since BIOS passwords can make encryption keys unusable on other systems (due to hashes etc.), you should use hdparm.

See https://www.zeitgeist.se/2014/09/07/enabling-ata-security-on-a-self-encrypting-ssd/ for detailed explanations.


##  Partition table


  * 200MB, type EF00 (EFI partition). This is used by GRUB2/BIOS-GPT. (/dev/sda1)
  * 100MB, type 8300 (Linux). This will store /boot (/dev/sda2)
  * 8GB, type 8200 (swap). This is our dedicated swap partition (not part of lvm). (/dev/sda3)
  * Remaining space, type 8E00 (LVM). Store both / and /home. (/dev/sda4).

So we get the following partition table:


```
sudo fdisk -l /dev/sda
Disk /dev/sdb: 238.5 GiB, 256060514304 bytes, 500118192 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 2745CF02-2F53-4647-9EDF-0D7FA8DA3110

Device        Start       End   Sectors   Size Type
/dev/sda1      2048   1026047   1024000   500M EFI System
/dev/sda2   1026048   1435647    409600   200M Linux filesystem
/dev/sda3   1435648  18212863  16777216     8G Linux swap
/dev/sda4  18212864 500118158 481905295 229.8G Linux LVM
```


## Prepare encrypted LUKS space

We need to align, enable TRIM and use the right payload for SSD.

  sudo  cryptsetup  benchmark
  sudo cryptsetup -c aes-xts-plain --key-size 512 -y -h sha512 --align-payload=8192 luksFormat /dev/sda4
  sudo cryptsetup luksOpen --allow-discards /dev/sda4 enc-lvm

##  Setup LVM space

```
sudo lvm pvcreate --dataalignment 4M /dev/mapper/enc-lvm
sudo lvm vgcreate vgroup /dev/mapper/enc-lvm
sudo lvm lvcreate -L 30GB -n root vgroup
sudo lvm lvcreate -n root -L 30G vgroup
### sudo lvm lvcreate -n home -l 100%FREE vgroup  ## not recommended if you want  to  keep  some free space for snapshots
### sudo lvm lvcreate -n home -L 400GB -n home vgroup
```

## Configure block devices, filesystems, and mountpoints

### Format /boot, /root and /home

Format and enable TRIM support.

```
sudo mkfs.ext2 /dev/sda2
sudo mkfs.ext4 -E discard /dev/mapper/vgroup-root
sudo mkfs.ext4 -E discard /dev/mapper/vgroup-home
```

### Get 5% space from /home partition

5% space are by default hidden on ext4 partitions. This is typically used on root partition as a safeguard when the disk gets full. On non-root partition this hidden space can be easily and safely reclaimed back by using the following command.

  sudo tune2fs -m 0 /dev/mapper/vgroup-home


## Installation

Install your system via CLI or  GUI installer.

Do  not reboot after installation is finnished.

## Mount  and  chroot into newly installed  system

```
sudo cryptsetup luksOpen --allow-discards /dev/sda4 enc-lvm
sudo mount /dev/mapper/vgroup-root /mnt/
sudo mount /dev/mapper/vgroup-home /mnt/home/
sudo  mount  /dev/sda2 /mnt/boot/
sudo  mount  /dev/sda1 /mnt/boot/efi/
sudo  mount -t proc proc /mnt/proc
sudo  mount -t sysfs sys /mnt/sys
sudo mount -o bind /dev /mnt/dev
sudo  mount -t devpts pts /mnt/dev/pts/
sudo chroot /mnt/
```

## Configure and build ramdisk

Edit MODULES and HOOKS in _/etc/mkinitcpio.conf_

  MODULES="dm_mod dm_crypt ext4 aes_x86_64 sha256 sha512"

Aadd _encrypt_ and _lvm2_ prior to _filesystem_ and _resume_ under the HOOKS section:

  HOOKS="base udev autodetect modconf block keyboard keymap plymouth plymouth-encrypt lvm2 resume filesystems fsck"

Rebuild kernel's ramdisk:

   mkinitcpio -p linux<version>
   
The version string represents your current kernel. For example "linux318" if you're running kernel 3.18

   mkinitcpio -p linux318

## Adjust GRUB config

Edit _/etc/defaults/grub_ and adjust as follows:

```
GRUB_CMDLINE_LINUX="cryptdevice=/dev/sda4:vgroup:allow-discards"
# if your want to use UUIDs (get with "blkid /dev/sda"):
# GRUB_CMDLINE_LINUX="cryptdevice=/dev/disk/by-uuid/8c57b57b-9714-40eb-9b4d-13f8a67c164b:vgroup:allow-discards"
```

If you don't want to enable TRIM support, leave out the _allow-discards_ option.

## Mount Flags

Edit /mnt/etc/fstab to add TRIM support

```
# <file system>                           <mount point>  <type>  <options>  <dump>  <pass>
/dev/mapper/vgroup-home            /home      ext4    defaults,noatime,discard 0 2
/dev/mapper/vgroup-root            /          ext4    defaults,noatime,discard 0 1
# using UUIDs (blkid /dev/mapper/vgroup-root)
# UUID=cc323893-0ee3-42b1-af8c-9f3bdde904e7 /home          ext4    defaults,noatime 0       2
# UUID=8c57b57b-9714-40eb-9b4d-13f8a67c164b /              ext4    defaults,noatime,discard 0       1

UUID=f6c7a434-278b-4e65-baea-5b8baffec853 swap           swap    defaults,noatime,discard 0       2
UUID=CA3B-BF7A                            /boot/efi      vfat    defaults,noatime 0       2
UUID=15197f00-0536-4847-96f0-2d33204adf0f /boot          ext2    defaults,noatime 0       2
```

We're done und you finally can safely reboot into your new system ;)

