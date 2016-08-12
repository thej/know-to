# After installation steps for Arch Linux


## Packages to install

yaourt -S mackup inkscape gimp owncloud-client firefox vivaldi sublime-text-dev ttf-google-fonts otf-fira-mono otf-fira-sans ttf-ms-fonts rhythmbox thunderbird filezilla keepassx calibre homebank smplayer dropbox encfs electrum qownnotes wine winetricks nxt mariadb watson steam tor-browser-en meld python-pip libreoffice-fresh xskat gnome-encfs-hg


## profile-sync-daemon

yaourt -S profile-sync-daemon


## Watson 

- Copy or symlink _~.watson.cfg_ from owncloud
- `watson restore`


## Locale settings

_/etc/locale.conf_:

```
LANG=en_US.UTF-8
LC_NUMERIC=de_DE.UTF-8
LC_TIME=de_DE.UTF-8
LC_COLLATE=de_DE.UTF-8
LC_MONETARY=de_DE.UTF-8
LC_NAME=de_DE.UTF-8
LC_ADDRESS=de_DE.UTF-8
LC_TELEPHONE=de_DE.UTF-8
LC_MEASUREMENT=de_DE.UTF-8
```

Activate nodeadkeys:

`echo KEYMAP=de-latin1-nodeadkeys > /etc/vconsole.conf`

```
localectl --no-convert set-keymap de-latin1-nodeadkeys
localectl --no-convert set-x11-keymap de pc105 nodeadkeys
```


## Automount encfs

- Install `libreoffice-fresh`
- `gnome-encfs -a ~/ownCloud/.private ~/crypt`


## Dark theme for GIMP and Inkscape

Install either Vertex or FlatStudioDark Theme:

```
yaourt -S gtk-theme-flatstudio
yaourt -S vertex-themes
```

Create custom launcher script _~/bin/inkscape_:

```
#!/bin/bash
export GTK2_RC_FILES=/usr/share/themes/FlatStudioDark/gtk-2.0/gtkrc 
/usr/bin/inkscape
```

`chmod u+x ~/bin/inkscape`

Create an application launcher _~/.local/share/applications/inkscape.desktop_:

```
#!/usr/bin/env xdg-open

[Desktop Entry]
Version=1.0
Name=InkscapeDark
GenericName=Vector Graphics Editor
X-GNOME-FullName=Inkscape Vector Graphics Editor
Comment=Create and edit Scalable Vector Graphics images
Type=Application
Categories=Graphics;VectorGraphics;GTK;
MimeType=image/svg+xml;image/svg+xml-compressed;application/vnd.corel-draw;application/pdf;application/postscript;image/x-eps;application/illustrator;
Exec=/home/<USERNAME>/bin/inkscape %F 
Path=/home/<USERNAME>/bin
Terminal=false
StartupNotify=true
Icon=inkscape
X-Ayatana-Desktop-Shortcuts=Drawing
```

Replace <USERNAME> with your username ;)

### Inkscape
