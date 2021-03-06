# Homeserver


## Encrypting system HD

See [Encrypt SSD with LUKS and LVM](../linux/encrypt_system_ssd.md)


## RAID1 encrypted data partition with LVM

See [RAID + LVM](../linux/raid+lvm.md)



## Change LAN device name

Edit */etc/udev/rules.d/10-network.rules*:

```
SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="<YOUR MAC ADDRESS GOES HERE>", NAME="lan0"
```


## Remote SSH shell into initram to unlock encrypted devices

Requirements: install *yaourt* package from AUR

Install the following packages:
- dropbear
- [https://aur.archlinux.org/packages/mkinitcpio-netconf/](mkinitcpio-netconf) (AUR)
- [https://aur.archlinux.org/packages/mkinitcpio-dropbear/](mkinitcpio-dropbear) (AUR)
- [https://aur.archlinux.org/packages/mkinitcpio-utils/](mkinitcpio-utils) (AUR)

Copy your SSH pubkey to */etc/dropbear/root_key*.

Add the *netconf*, *dropbear* and *encryptssh* hooks before filesystems within the "HOOKS" array in */etc/mkinitcpio.conf* (the encryptssh can be used to replace the encrypt hook).
```
# /etc/mkinitcpio.conf
MODULES="dm_mod dm_crypt ext4 aes_x86_64 sha256 sha512 r8169 i915"
HOOKS="base udev autodetect modconf block mdadm lvm2 netconf dropbear encryptssh filesystems keyboard fsck"
```

Rebuild with `mkinitcpio -p linux`.

Provide networking by adding *ip* kernel parameter to GRUB config */etc/default/grub*:
```
GRUB_CMDLINE_LINUX="cryptdevice=/dev/sda3:vgroup:allow-discards ip=:::::eth0:dhcp"
```

Rebuild grub config:
`grub-mkconfig -o /boot/grub/grub.cfg`

Reboot and login as root user to unlock encrypted devices.

> Source: https://wiki.archlinux.org/index.php/Dm-crypt/Specialties


## Network Plan

See [Network Plan](network_plan.md).


## Power management



## List of applications and services

### Required
- GitLab 
- Mail: IMAP, SMTP, spamassassin...
- DHCP, DNS/dnsec
- firewall / DMZ

### Optional
- ownCloud


## Containers: Docker, LXC, systemd-nspawn


## Usefull links
- Detailed Homeserver tut based on slackware: http://www.mbse.eu/linux/homeserver/
- http://mein.homelinux.com/wiki/wiki/10_schritte



