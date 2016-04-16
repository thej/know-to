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

Add public key to ~/.ssh/authorized_keys.

Edit */etc/sshd_config*:

```
# Package generated configuration file
# See the sshd_config(5) manpage for details

Port 22
Protocol 2
# HostKeys for protocol version 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_dsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key
HostKey /etc/ssh/ssh_host_ed25519_key
#Privilege Separation is turned on for security
UsePrivilegeSeparation yes

# Lifetime and size of ephemeral version 1 server key
KeyRegenerationInterval 3600
ServerKeyBits 1024

# Logging
SyslogFacility AUTH
LogLevel INFO

# Authentication:
LoginGraceTime 120
PermitRootLogin no
StrictModes yes

RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile      %h/.ssh/authorized_keys

# Don't read the user's ~/.rhosts and ~/.shosts files
IgnoreRhosts yes
# For this to work you will also need host keys in /etc/ssh_known_hosts
RhostsRSAAuthentication no
# similar for protocol version 2
HostbasedAuthentication no
# Uncomment if you don't trust ~/.ssh/known_hosts for RhostsRSAAuthentication
#IgnoreUserKnownHosts yes

# To enable empty passwords, change to yes (NOT RECOMMENDED)
PermitEmptyPasswords no

# Change to yes to enable challenge-response passwords (beware issues with
# some PAM modules and threads)
ChallengeResponseAuthentication no

# Change to no to disable tunnelled clear text passwords
PasswordAuthentication no

X11Forwarding yes
X11DisplayOffset 10
PrintMotd no
PrintLastLog yes
TCPKeepAlive yes
#UseLogin no

#MaxStartups 10:30:60
#Banner /etc/issue.net

# Allow client to pass locale environment variables
AcceptEnv LANG LC_*

Subsystem sftp /usr/lib/openssh/sftp-server

# Set this to 'yes' to enable PAM authentication, account processing,
# and session processing. If this is enabled, PAM authentication will
# be allowed through the ChallengeResponseAuthentication and
# PasswordAuthentication.  Depending on your PAM configuration,
# PAM authentication via ChallengeResponseAuthentication may bypass
# the setting of "PermitRootLogin without-password".
# If you just want the PAM account and session checks to run without
# PAM authentication, then enable this but set PasswordAuthentication
# and ChallengeResponseAuthentication to 'no'.
UsePAM yes
```

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

Edit the configuration file for setting system variables */etc/sysctl.conf*:

```
# Prevent SYN attack.
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 5
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_max_syn_backlog = 1024

# Disables packet forwarding.
net.ipv4.ip_forward = 0
net.ipv4.conf.all.forwarding = 0
net.ipv4.conf.default.forwarding = 0
net.ipv6.conf.all.forwarding = 0
net.ipv6.conf.default.forwarding = 0

# Disables IP source routing.
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# Do not accept ICMP redirects (prevent MITM attacks).
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0

# Enable Spoof protection (reverse-path filter).
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.rp_filter = 1

# Disable Log Spoofed Packets, Source Routed Packets, Redirect Packets.
net.ipv4.conf.all.log_martians = 0
net.ipv4.conf.default.log_martians = 0

# Decrease the time default value for tcp_fin_timeout connection.
net.ipv4.tcp_fin_timeout = 15

# Decrease the time default value for connections to keep alive.
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_keepalive_probes = 5
net.ipv4.tcp_keepalive_intvl = 15

# Don't relay bootp.
net.ipv4.conf.all.bootp_relay = 0

# Don't proxy arp for anyone.
net.ipv4.conf.all.proxy_arp = 0

# Turn on SACK.
net.ipv4.tcp_dsack = 1
net.ipv4.tcp_sack = 1
net.ipv4.tcp_fack = 1

# Turn on the tcp_timestamps.
net.ipv4.tcp_timestamps = 1

# Don't ignore directed pings.
net.ipv4.icmp_echo_ignore_all = 0

# Enable ignoring broadcasts request.
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Enable bad error message Protection.
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Specify the allowed local port range.
net.ipv4.ip_local_port_range = 2000 65535

# Protect Against TCP Time-Wait.
net.ipv4.tcp_rfc1337 = 1

# Specify the minimum of free memory in KB.
vm.min_free_kbytes = 8192
```

Apply the changes to sysctl: `sysctl -p`

## DNS Server


## Backup
