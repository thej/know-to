# LXC Containers (ARCH)

## Create container

```
lxc-create -n <containername> -t download
```


## Default container config


### Arch Cpntainer

```
lxc.network.type = veth
lxc.network.name = eth0
lxc.network.link = br0
lxc.network.flags = up
lxc.network.veth.pair = veth0-pandora
lxc.network.ipv4=10.200.200.222/8
lxc.network.ipv4.gateway=10.200.200.1

lxc.kmsg = 0
lxc.rootfs = /data/lxc/pandora/rootfs
lxc.rootfs.backend = dir
lxc.utsname = pandora
lxc.arch = x86_64
lxc.include = /usr/share/lxc/config/archlinux.common.conf

# disables AppArmor confinement
lxc.aa_profile = unconfined
# give all capabilities to the processes in LXC container
lxc.cap.drop =

lxc.start.auto = 1
```

### Alpine Container
```
lxc.network.type = veth
lxc.network.name = eth0
lxc.network.link = br0
lxc.network.flags = up
lxc.network.veth.pair = veth0-alpinetpl
lxc.network.ipv4=10.200.200.223/8
lxc.network.ipv4.gateway=10.200.200.1

lxc.rootfs = /var/lib/lxc/alpinetemplate/rootfs
lxc.rootfs.backend = dir
lxc.arch = x86_64

# Set hostname.
lxc.utsname = alpinetemplate

# If something doesn't work, try to comment this out.
# Dropping sys_admin disables container root from doing a lot of things
# that could be bad like re-mounting lxc fstab entries rw for example,
# but also disables some useful things like being able to nfs mount, and
# things that are already namespaced with ns_capable() kernel checks, like
# hostname(1).
lxc.cap.drop = sys_admin

# Include common configuration.
lxc.include = /usr/share/lxc/config/alpine.common.conf

lxc.start.auto = 1
```
