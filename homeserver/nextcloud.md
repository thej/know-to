# Nextcloud with nginx

## Install required packages

```
sudo pacman -S nginx php php-fpm php-gd php-mcrypt php-intl
```

## Configure PHP

Enable modules in _/etc/php/php.ini_:

```
extension=gd.so
extension=iconv.so
extension=xmlrpc.so
extension=zip.so
extension=bz2.so
extension=curl.so
extension=intl.so
extension=mcrypt.so
extension=pdo_mysql.so
extension=mysqli.so
zend_extension=opcache.so
```

Add open_basedir

```
open_basedir = /srv/http/:/var/www/:/home/nextcloud/:/tmp/:/usr/share/pear/:/usr/share/webapps/
```

## Install mariadb

```
pacman -S mariadb
mysql_install_db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
systemctl start mysqld.service
mysql_secure_installation
```

In the /etc/mysql/my.cnf file section under the mysqld group, add:

```
[mysqld]
init_connect                = 'SET collation_connection = utf8_general_ci,NAMES utf8'
collation_server            = utf8_general_ci
character_set_client        = utf8
character_set_server        = utf8
```

Update

```
mysql_upgrade -u root -p
```

Populate time zone tables

```
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql
```

Add database and user

```
mysql -u root -p

CREATE DATABASE nextcloud;
CREATE USER cloud@localhost;
SET PASSWORD FOR cloud@localhost= PASSWORD("password_for_cloud");
GRANT ALL PRIVILEGES ON cloud.* TO cloud@localhost IDENTIFIED BY 'password_for_cloud';
FLUSH PRIVILEGES;
exit
```

Autostart

```
systemctl enable mysqld.service
```


## Add user for nextcloud

```
groupadd nextcloud
useradd -g nextcloud -m -s /usr/bin/nologin nextcloud

# Add user http to group nextcloud
gpasswd -a http nextcloud
```

## Add new php-fpm pool

Add new file _/etc/php/php-fpm.d/nextcloud.conf_:

```
[nextcloud]
user = nextcloud
group = nextcloud
listen = /run/php-fpm/nextcloud.sock
listen.owner = http
listen.group = http
listen.backlog = -1
listen.allowed_clients = 127.0.0.1
;listen.mode = 0660
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
pm.max_requests = 500
;chroot = /home/nextcloud
;chdir = /nextcloud_current
```


## Nginx configuration

```
server {
    listen 80;
    server_name cloud.tzuiop.net;

    location /.well-known/acme-challenge/ {
        default_type "text/plain";
        root /var/www/cloud.tzuiop.net;
    }

    if ($request_uri !~ "\.well-known" ) {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name cloud.tzuiop.net;
    server_tokens off;
    
    ssl on;
    ssl_certificate /etc/letsencrypt/live/cloud.tzuiop.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cloud.tzuiop.net/privkey.pem;
    ssl_session_timeout 10m;

    # enablee HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";
    add_header X-Clacks-Overhead "GNU Terry Pratchett";

    root /home/nextcloud/nextcloud_current;

    client_max_body_size 10G; # set max upload size
    fastcgi_buffers 64 4K;

    rewrite ^/caldav(.*)$ /remote.php/caldav$1 redirect;
    rewrite ^/carddav(.*)$ /remote.php/carddav$1 redirect;
    rewrite ^/webdav(.*)$ /remote.php/webdav$1 redirect;

    index index.php;
    error_page 403 /core/templates/403.php;
    error_page 404 /core/templates/404.php;

    access_log /var/log/nginx/cloud.tzuiop.net.access.log;
    error_log /var/log/nginx/cloud.tzuiop.net.error.log;


    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    location ~ ^/(data|config|\.ht|db_structure\.xml|README) {
        deny all;
    }

    location / {
        # The following 2 rules are only needed with webfinger
        rewrite ^/.well-known/host-meta /public.php?service=host-meta last;
        rewrite ^/.well-known/host-meta.json /public.php?service=host-meta-json last;

        rewrite ^/.well-known/carddav /remote.php/carddav/ redirect;
        rewrite ^/.well-known/caldav /remote.php/caldav/ redirect;

        rewrite ^(/core/doc/[^\/]+/)$ $1/index.html;

        try_files $uri $uri/ index.php;
    }

    location ~ ^(.+?\.php)(/.*)?$ {
        try_files $1 =404;

        include fastcgi_params;
        fastcgi_param MOD_X_ACCEL_REDIRECT_ENABLED on;
        fastcgi_param SCRIPT_FILENAME $document_root$1;
        fastcgi_param PATH_INFO $2;
        fastcgi_param HTTPS on;
        fastcgi_pass unix:/run/php-fpm/nextcloud.sock;
    }

    location ~ ^/home/nextcloud/ncdata/ {
        internal;
        root /;
    }

    location ~ ^/tmp/oc-noclean/.+$ {
        internal;
        root /;
    }

    # Optional: set long EXPIRES header on static assets
    location ~* ^.+\.(jpg|jpeg|gif|bmp|ico|png|css|js|swf)$ {
        expires 30d;
        # Optional: Don't log access to assets
        access_log off;
    }
}
```


## Install nextcloud

```
sudo -su nextcloud
cd
wget https://download.nextcloud.com/server/releases/nextcloud-9.0.51.tar.bz2
wget https://download.nextcloud.com/server/releases/nextcloud-9.0.51.tar.bz2.sha256
sha256sum -c nextcloud-9.0.51.tar.bz2.sha256
tar xjvf nextcloud-9.0.51.tar.bz2
mv nextcloud nextcloud-9.0.51
ln -s nextcloud-9.0.51 nextcloud_current
```

Enable nginx vhost.

Start PHP:

```
sudo systemctl enable php-fpm
sudo systemctl start php-fpm
sudo systemctl enable nginx
sudo systemctl start nginx
```