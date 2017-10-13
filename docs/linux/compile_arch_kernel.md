Compile Kernel (Arch)
=====================

```bash
cd ~/
mkdir build
cd build/

ABSROOT=. asp checkout core/linux
```

Edit PKGBUILD:

```
...
pkgbase=linux-custom
...
```

Use existing Kernel config:

```
zcat /proc/config.gz > config.x86_64
```

Generate new checksums:

`updpkgsums`

Compile:

`makepkg`

Install headers and kernel:

```
pacman -U linux-custom-headers-*
pacman -u linux-custom-*
```

Update Grub:

`sudo grub-mkconfig -o /boot/grub/grb.cfg`


