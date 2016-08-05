# Install Ubuntu Touch on Nexus 5

## Install Flash tools

### Method 1: Ubuntu inside Docker

Use Ubuntu docker container and mount usb devices as volumes

`docker run -i -t --name ubuntu --privileged -v /dev/bus/usb:/dev/bus/usb ubuntu:latest /bin/bash`

Install required software

```bash
apt-get update
apt-get install ubuntu-device-flash phablet-tools
```


### Method 2: Arch Linux

`yaourt -S ubuntu-device-flash`


## Flash the ROM

Flash Ubuntu Touch:

```
ubuntu-device-flash --server=http://system-image.ubports.com touch --channel=ubuntu-touch/stable --device=hammerhead --bootstrap
```


## Sync with owncloud/carddav/webdav

Login with ADB.

```
sudo -s

syncevolution --configure --template WebDAV username=<username> password=<'password'> syncURL=https://my.example.org/remote.php/ keyring=no target-config@owncloud

syncevolution --configure database=https://my.example.org/remote.php/carddav/addressbooks/<username>/<addressbookname>/ backend=carddav target-config@owncloud contacts

syncevolution --configure --template SyncEvolution_Client sync=none syncURL=local://@owncloud username= password= owncloud

syncevolution --configure sync=two-way backend=addressbook database= owncloud contacts

syncevolution --sync slow owncloud contacts
```

Caldav:

```
syncevolution --configure database=https://my.example.org/remote.php/caldav/calendars/<USERNAME>/personal backend=caldav target-config@owncloud calendar

syncevolution --configure sync=two-way backend=events database="personal" owncloud calendar
```

To sync again:

`syncevolution owncloud calendar contacts`


## Bugs

- System hangs on shutdown/reboot



## References

- https://developer.ubuntu.com/en/phone/devices/installing-ubuntu-for-devices/
- https://devices.ubports.com/#/hammerhead

