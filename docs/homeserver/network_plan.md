# Homeserver Network Plan

Two physical interfaces:

1. **lan0**: 1GBit interface conecting to the local client computers
2. **wan0**: 100/1000Mbit interface connecting to the DSL router. IP by DHCP.

Local LAN network: 10.200.200.0/21, which leaves us with 8 class C nets:

10.200.200.0/24 - Clients LAN
10.200.201.0/24 - reserved for later use
10.200.202.0/24 - reserved for later use
10.200.203.0/24 - reserved for later use
10.200.204.0/24 - reserved for later use
10.200.205.0/24 - reserved for later use
10.200.206.0/24 - reserved for later use
10.200.207.0/24 - reserved for later use

## Services on homeserver network:

DHCP and DNS for

Packages needed: 
`bind dnsmasq inetd iproute2 iptables iputils`

Domain: *hephaistos.local*

## Persistan device names for interfaces

*/etc/udev/rules.d/10-network.rules*:
```
SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="<YOUR MAC GOES HERE>", NAME="lan0"
SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="<YOUR MAC GOES HERE>", NAME="wan0"
```
