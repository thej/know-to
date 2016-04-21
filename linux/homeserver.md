# Homeserver

## /etc/default/grub
```
GRUB_TIMEOUT=5
GRUB_DISTRIBUTOR="Arch"
#GRUB_CMDLINE_LINUX_DEFAULT="quiet"
GRUB_CMDLINE_LINUX_DEFAULT="quiet"
#GRUB_CMDLINE_LINUX="cryptdevice=/dev/sda3:vgroup:allow-discards"
GRUB_CMDLINE_LINUX="cryptdevice=/dev/disk/by-uuid/e626917d-7cde-492d-81df-f70a572d4fbf:vgroup:allow-discards"
#GRUB_HIDDEN_TIMEOUT_QUIET=true
```

## /etc/mkinitcpio.conf

```
MODULES="dm_mod dm_crypt ext4 aes_x86_64 sha256 sha512 i915"
HOOKS="base udev autodetect modconf block mdadm encrypt lvm2 resume filesystems keyboard fsck"
```

## Encrypting system HD

```
cryptsetup -c aes-xts-plain --key-size 256 -y -h sha256 --align-payload=8192 luksFormat /dev/sda3
...
```

## Change LAN device name

Edit */etc/udev/rules.d/10-network.rules*:

```
SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="<YOUR MAC ADDRESS GOES HERE>", NAME="lan0"
```



## List of applications and services

### Required
- GitLab 
- Mail: IMAP, SMTP, spamassassin...

### Optional
- ownCloud


## Brainstorming
- Use containers for services and apps: docker vs systemd-nspawn
- Define network plan
- Firewall? DMZ?

## Containers: Docker vs LXC vs systemd-nspawn

### Docker
- just for apps
- uses NAT

### systemd-nspawn
- "chroot on steroids"
- can (deb)botstrap a system in a directory, isolate it inside a container and boot it
- does only full systems, not single apps

### LXS

## Distributions
- CoreOS?
- Slackware?
- 

## Links
- Detailed Homeserver tut based on slackware: http://www.mbse.eu/linux/homeserver/
- How to install arch linux server: http://www.linuxveda.com/2015/03/27/how-to-install-arch-linux-server-tutorial/
- Arch Server doc: https://wiki.archlinux.org/index.php/Server
- http://mein.homelinux.com/wiki/wiki/10_schritte



