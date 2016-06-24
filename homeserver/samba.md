# Samba

## _/etc/samba/smb.conf_

```
[global]
  workgroup = OLYMPUS
  server string = HEPHAISTOS
  netbios name = HEPHAISTOS
  hosts allow = 192.168.222. 127.
  deadtime = 60
  disable netbios = yes
  dns proxy = no
  invalid users = root 
  security = user 
  map to guest = Bad User
  max connections = 100
  log file = /var/log/samba/%m.log
  max log size = 50
  encrypt passwords = yes
  smb passwd file = /etc/samba/smbpasswd
  unix password sync = no
  preserve case = yes
  short preserve case = yes

  # Interfaces to listen on
  ; interfaces = 192.168.222.28/24 192.168.188.84/24 
  interfaces = 192.168.222.28/24
  
  # Disable printer support
  load printers = no
  printing = bsd
  printcap name = /dev/null
  disable spoolss = yes
  show add printer wizard = no
  print notify backchannel = no
  
  # Unix users can map to different SMB User names
  ;  username map = /etc/samba/smbusers

  # Default permissions for all shares  
  inherit owner = yes 
  create mask = 0660 
  directory mask = 0770
  force create mode = 0660
  force directory mode = 0770

  # Performance tuning
  socket options = TCP_NODELAY IPTOS_LOWDELAY
  write cache size = 262144
  use sendfile = true
  getwd cache = yes
  min receivefile size = 16384
  max xmit = 65536
  
```