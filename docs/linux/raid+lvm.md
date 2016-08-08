# RAID + LVM + Encryption 

* 2 identical HDs (/dev/hdb and /dev/hdc)

## Partitioning

### Preparing first HD

```
gdisk /dev/sdb
# create partition with type fd00 (Raid)
# write and exit
```

### Clone partition table to /dev/sdc
Clone partitions with *sgdisk*:

```
sgdisk --backup=table /dev/sdb
sgdisk --load-backup=table /dev/sdc
```

### Create RAID array
`mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sd[bc]1`



## Encryption

```
cryptsetup luksFormat -c aes-xts-plain64 -s 512 /dev/md0
cryptsetup luksOpen /dev/md0 cryptdisk
```


## LVM

The three next steps create, in this order, the physical volume (the container, if you will), the group and then the individual volumes contained in the group. Choose simple, memorable names and do not hypenate them. The {pv,vg,lv}display commands print out the details of the devices once created.
    
```
pvcreate /dev/mapper/cryptdisk
pvdisplay

vgcreate vgraid /dev/mapper/cryptdisk
vgdisplay

lvcreate -l +100%FREE  vgraid -n data
```



### Format volume

`mkfs.ext4 -L data -m 0 /dev/vgraid/data`

### Get 5% space from data volume

5% space are by default hidden on ext4 partitions. This is typically used on root partition as a safeguard when the disk gets full. On non-root partition this hidden space can be easily and safely reclaimed back by using the following command.

`tune2fs -m 0 /dev/mapper/data `

## Update RAID configuration

Since the installer builds the initrd using /etc/mdadm.conf in the target system, you should update that file with your RAID configuration. The original file can simply be deleted because it contains comments on how to fill it correctly, and that is something mdadm can do automatically for you. So let us delete the original and have mdadm create you a new one with the current setup:

`mdadm --examine --scan >> /etc/mdadm.conf`


## crypttap and fstab

Generate a keyfile:
`dd bs=512 count=4 if=/dev/urandom of=/etc/keyfile_cryptdisk iflag=fullblock`

Add keyfile to key slot:
`cryptsetup luksAddKey /dev/md0 /etc/keyfile_cryptdisk`

Add */etc/crypttab* entry: 
```
cryptdisk       /dev/md0                /etc/keyfile_cryptdisk
```

Add */etc/fstab* entry

```
/dev/vgraid/data        /data           ext4            defaults,relatime       0 1
```








