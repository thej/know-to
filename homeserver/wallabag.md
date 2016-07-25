# Wallabag installation

## Add database 

```
CREATE DATABASE wallabag;
CREATE USER wallabag@localhost;
SET PASSWORD FOR wallabag@localhost= PASSWORD("password_for_wallabag");
GRANT ALL PRIVILEGES ON wallabag.* TO wallabag@localhost IDENTIFIED BY 'password_for_cloud';
FLUSH PRIVILEGES;
exit
```

## nginx config

```
server {
    listen 80;
    server_name wallabag.tzuiop.net;

    location /.well-known/acme-challenge/ {
        default_type "text/plain";
        root /var/www/wallabag.tzuiop.net;
    }

    if ($request_uri !~ "\.well-known" ) {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name wallabag.tzuiop.net;
    server_tokens off;
    
    ssl on;
    ssl_certificate /etc/letsencrypt/live/wallabag.tzuiop.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wallabag.tzuiop.net/privkey.pem;
    ssl_session_timeout 10m;

    # enablee HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";
    add_header X-Clacks-Overhead "GNU Terry Pratchett";

    root /home/wallabag/wallabag/web;

    client_max_body_size 10M; # set max upload size
    fastcgi_buffers 64 4K;

    access_log /var/log/nginx/wallabag.tzuiop.net.access.log;
    error_log /var/log/nginx/wallabag.tzuiop.net.error.log;


    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    location / {
        # try to serve file directly, fallback to app.php
        try_files $uri /app.php$is_args$args;
    }

    location ~ ^/app\.php(/|$) {
        fastcgi_pass unix:/run/php-fpm/wallabag.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param MOD_X_ACCEL_REDIRECT_ENABLED on;
        fastcgi_param PATH_INFO $2;
        fastcgi_param HTTPS on;
        fastcgi_param  SCRIPT_FILENAME  $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        # Prevents URIs that include the front controller. This will 404:
        # http://domain.tld/app.php/some-path
        # Remove the internal directive to allow URIs like this
        internal;
    }
}
```


## _/etc/php/php-fpm.d/wallabag.conf_

```
[wallabag]
user = wallabag
group = wallabag
listen = /run/php-fpm/wallabag.sock
listen.owner = wallabag
listen.group = wallabag
listen.backlog = -1
listen.allowed_clients = 127.0.0.1
listen.mode = 0666
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
pm.max_requests = 500
env[HOSTNAME] = $HOSTNAME
env[PATH] = /usr/local/bin:/usr/bin:/bin
env[TMP] = /tmp
env[TMPDIR] = /tmp
env[TEMP] = /tmp

;chroot = /home/wallabag
;chdir = /wallabag
```