# Firewall

## Basic concepts

```
                               XXXXXXXXXXXXXXXXXX
                             XXX     Network    XXX
                               XXXXXXXXXXXXXXXXXX
                                       +
                                       |
                                       v
 +-------------+              +------------------+
 |table: filter| <---+        | table: nat       |
 |chain: INPUT |     |        | chain: PREROUTING|
 +-----+-------+     |        +--------+---------+
       |             |                 |
       v             |                 v
 [local process]     |           ****************          +--------------+
       |             +---------+ Routing decision +------> |table: filter |
       v                         ****************          |chain: FORWARD|
****************                                           +------+-------+
Routing decision                                                  |
****************                                                  |
       |                                                          |
       v                        ****************                  |
+-------------+       +------>  Routing decision  <---------------+
|table: nat   |       |         ****************
|chain: OUTPUT|       |               +
+-----+-------+       |               |
      |               |               v
      v               |      +-------------------+
+--------------+      |      | table: nat        |
|table: filter | +----+      | chain: POSTROUTING|
|chain: OUTPUT |             +--------+----------+
+--------------+                      |
                                      v
                               XXXXXXXXXXXXXXXXXX
                             XXX    Network     XXX
                               XXXXXXXXXXXXXXXXXX
```


## Best practices
- place loopback rules as early as possible
- place forwading rules as early as possible
- use state and connection tracking to bypass firewall for established connections
- combine rules using port lists
- place rues for heavy traffic services as early as possible

## Example basic configuration

### Interfaces used:

- lan0: internal network
- wan0: external network/internet
- lxcbr0: DMZ
 

### Firewall Script

```sh
#!/bin/sh

# CONFIG
##############################
# Where to find iptables command
IPT=/sbin/iptables

SERVER_IP="192.168.222.28"
WAN_IP="192.168.188.84"
DMZ_IP="10.200.200.222"

WAN_IF="wan0"
LAN_IF="lan0"
DMZ_IF="br0"

LAN_NET="192.168.222.0/24"
WAN_NET="192.168.188.0/24"
DMZ_NET="10.0.0.0/8"

# Private, multicast, loopback and reserved networks
LOOPBACK="127.0.0.0/8"
CLASS_A="10.0.0.0/8"
CLASS_B="172.16.0.0/12"
CLASS_C="192.168.0.0/16"
CLASS_D_MULTICAST="224.0.0.0/4"
CLASS_E_RESERVED="240.0.0.0/5"


###############################

# Flush all existing rules
$IPT -F
$IPT -X
$IPT -t nat -F
$IPT -t nat -X
$IPT -t mangle -F
$IPT -t mangle -X
$IPT -P INPUT ACCEPT
$IPT -P FORWARD ACCEPT
$IPT -P OUTPUT ACCEPT

# Default policies
$IPT -P OUTPUT ACCEPT
$IPT -P INPUT DROP
$IPT -P FORWARD DROP

# Allow lo interface
$IPT -A INPUT -i lo -j ACCEPT
$IPT -A OUTPUT -o lo -j ACCEPT 

# Allow already established sessions
$IPT -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
$IPT -A OUTPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Drop invalid packages
$IPT -A INPUT -m conntrack --ctstate INVALID -j DROP

# Refuse spoofed packets pretending to be from the external interfaces IP
# $IPT -A INPUT -i $WAN_IF -s $IPADDR -j DROP

# Refuse packets claiming to be from private networks or loopback device
$IPT -A INPUT -i $WAN_IF -s $CLASS_A -j DROP
$IPT -A INPUT -i $WAN_IF -s $CLASS_B -j DROP
#$IPT -A INPUT -i $WAN_IF -s $CLASS_C -j DROP
$IPT -A INPUT -i $WAN_IF -s $LOOPBACK -j DROP

# Allow SSH to $SERVER_IP
$IPT -A INPUT -p tcp -s $LAN_NET -d $SERVER_IP --dport 22 -i $LAN_IF -j ACCEPT
$IPT -A INPUT -p tcp -s $WAN_NET -d $WAN_IP --dport 22 -i $WAN_IF -j ACCEPT
#$IPT -A INPUT -p tcp -s 0/0 -d $SERVER_IP --dport 22 -i $WAN_IF -j ACCEPT

# Enable masquerading for lan0/br0
$IPT -t nat -A POSTROUTING -o $LAN_IF -j MASQUERADE
$IPT -t nat -A POSTROUTING -s $DMZ_NET -j MASQUERADE

# Allow forwarding on bridge interface
$IPT -A FORWARD -p all -i $DMZ_IF -j ACCEPT

# allow traffic from internal ($LAN_IF) to DMZ ($DMZ_IF)
$IPT -A FORWARD -i $LAN_IF -o $DMZ_IF -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
$IPT -A FORWARD -i $DMZ_IF -o $LAN_IF -m state --state ESTABLISHED,RELATED -j ACCEPT

# allow traffic from internet ($WAN_IF) to DMZ ($DMZ_IF)
$IPT -A FORWARD -i $WAN_IF -o $DMZ_IF -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
$IPT -A FORWARD -i $DMZ_IF -o $WAN_IF -m state --state ESTABLISHED,RELATED -j ACCEPT


########################
### PORT FORWARDING ####
########################

# redirect incoming web requests (port 80,443) at $WAN_IF ($WAN_IP) of FIREWALL to web server at $DMZ_IP
$IPT -t nat -A PREROUTING -p tcp -i $WAN_IF -d $WAN_IP --dport 80 -j DNAT --to-dest $DMZ_IP
$IPT -t nat -A PREROUTING -p tcp -i $WAN_IF -d $WAN_IP --dport 443 -j DNAT --to-dest $DMZ_IP

# redirect port 2345 to $DMZ_IP
$IPT -t nat -A PREROUTING -p tcp -i $LAN_IF -d $SERVER_IP --dport 2345 -j DNAT --to-dest $DMZ_IP:22
$IPT -t nat -A PREROUTING -p tcp -i $WAN_IF -d $WAN_IP --dport 2345 -j DNAT --to-dest $DMZ_IP:22

# redirect incoming mail (SMTP) requests at $WAN_IF ($WAN_IP) of FIREWALL to Mail server at 192.168.20.3
#iptables -t nat -A PREROUTING -p tcp -i $WAN_IF -d $WAN_IP --dport 25 -j DNAT --to-dest 192.168.20.3

# redirect incoming DNS requests at $WAN_IF ($WAN_IP) of FIREWALL to DNS server at 192.168.20.4
#iptables -t nat -A PREROUTING -p udp -i $WAN_IF -d $WAN_IP --dport 53 -j DNAT --to-dest 192.168.20.4
#iptables -t nat -A PREROUTING -p tcp -i $WAN_IF -d $WAN_IP --dport 53 -j DNAT --to-dest 192.168.20.4

```

## Stop the firewall

```bash
#!/bin/sh
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT
```