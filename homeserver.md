# Homeserver

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



