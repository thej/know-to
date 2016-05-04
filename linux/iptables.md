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

```sh
#!/bin/sh

# CONFIG
##############################
# Where to find iptables command
IPT=/sbin/iptables

SERVER_IP="192.168.222.28"

WAN_IF="wan0"
LAN_IF="lan0"

LAN_NET="192.168.222.0/24"

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
$IPT -A INPUT -i $WAN_IF -s $CLASS_C -j DROP
$IPT -A INPUT -i $WAN_IF -s $LOOPBACK -j DROP

# Allow SSH
$IPT -A INPUT -p tcp -s $LAN_NET -d $SERVER_IP --dport 22 -i $LAN_IF -j ACCEPT
$IPT -A INPUT -p tcp -s 0/0 -d $SERVER_IP --dport 22 -i $WAN_IF -j ACCEPT


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