# Post-installation tips for Arch/Antergos Linux


## Packages to install

yaourt -S mackup inkscape gimp owncloud-client firefox vivaldi sublime-text-dev ttf-google-fonts otf-fira-mono otf-fira-sans ttf-ms-fonts rhythmbox thunderbird filezilla keepassx calibre homebank smplayer dropbox encfs electrum qownnotes wine winetricks nxt mariadb watson steam tor-browser-en meld python-pip libreoffice-fresh xskat gnome-encfs-hg arch-install-scripts android-tools android-udev


## profile-sync-daemon

yaourt -S profile-sync-daemon


## Watson 

- Copy or symlink _~.watson.cfg_ from owncloud
- `watson restore` 


## Locale settings

_/etc/locale.conf_:

```bash
LANG=en_US.UTF-8
LC_NUMERIC=de_DE.UTF-8
LC_TIME=de_DE.UTF-8
LC_COLLATE=de_DE.UTF-8
LC_MONETARY=de_DE.UTF-8
LC_NAME=de_DE.UTF-8
LC_ADDRESS=de_DE.UTF-8
LC_TELEPHONE=de_DE.UTF-8
LC_MEASUREMENT=de_DE.UTF-8
LC_MESSAGES=en_US.utf8
```

If using GNOME3, these variables also have to be set in the _~/.profile_.startup.

!!! hint
    - bash doesn't read .profile if a .bash_profile is found
    - Therefore created a .bash_profile which reads .profile and .bashrc afterwards, so gnome can read .profile without interfering with bash.
    - If a .bash_profile exists, nash won't read .profile -> source .profile from .bash_profile

```bash
export LANG=en_US.UTF-8
export LC_NUMERIC=de_DE.UTF-8
export LC_TIME=de_DE.UTF-8
export LC_COLLATE=de_DE.UTF-8
export LC_MONETARY=de_DE.UTF-8
export LC_NAME=de_DE.UTF-8
export LC_ADDRESS=de_DE.UTF-8
export LC_TELEPHONE=de_DE.UTF-8
export LC_MEASUREMENT=de_DE.UTF-8
export LC_MESSAGES=en_US.utf8
```



Activate nodeadkeys:

`echo KEYMAP=de-latin1-nodeadkeys > /etc/vconsole.conf`

```bash
localectl --no-convert set-keymap de-latin1-nodeadkeys
#localectl --no-convert set-x11-keymap de pc105 nodeadkeys
localectl set-x11-keymap de pc105 nodeadkeys
```


## Automount encfs

- Install `libreoffice-fresh`
- `gnome-encfs -a ~/ownCloud/.private ~/crypt`


## Dark theme for GIMP and Inkscape

### Inkscape

Install either Vertex or FlatStudioDark Theme:

```sh
yaourt -S gtk-theme-flatstudio
yaourt -S vertex-themes
```

Create custom launcher script _~/bin/inkscape_:

```bash
#!/bin/bash
export GTK2_RC_FILES=/usr/share/themes/FlatStudioDark/gtk-2.0/gtkrc 
/usr/bin/inkscape
```


`chmod u+x ~/bin/inkscape`

Create an application launcher _~/.local/share/applications/inkscape.desktop_:

```bash
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

### GIMP

Just place your desired theme inside the _~/.gimp-2.8/themes_ directory. Start Gimp and Select yout theme under the "Theme" tab.

Example Theme: https://www.gnome-look.org/content/show.php?content=160952

## Gnome-shell extensions

```bash
# ~/.local/share/gnome-shell/extensions/

'hide-legacy-tray@shell-extensions.jonnylamb.com'/
'maximus@luis.pabon.auronconsulting.co.uk'/
'mediaplayer@patapon.info'/
'openweather-extension@jenslody.de'/
'scroll-workspaces@gfxmonk.net'/
'shellshape@gfxmonk.net'/
'shell-volume-mixer@derhofbauer.at'/
'TeaTime@oleid.mescharet.de'/
'topIcons@adel.gadllah@gmail.com'/
'workspaces-to-dock@passingthru67.gmail.com'/
```

Download as tarball and extract into _~/.local/share/gnome-shell/extensions/_:

[gnome-shell-extensions.tar.gz](gnome-shell-extensions.tar.gz)
