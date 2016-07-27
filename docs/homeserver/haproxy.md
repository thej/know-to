# haproxy.cfg

```
global
    maxconn 256
    chroot /var/lib/haproxy
    stats socket /run/haproxy.sock mode 660 level admin
    stats timeout 30s
    user root
    group root
    daemon

defaults
    mode    http
    log     global
    option  httplog
    option  dontlognull
    option redispatch
    option forwardfor
    option  http-server-close
    timeout connect 5000
    timeout client  50000
    timeout server  50000


frontend http-in
    bind *:80
    acl host_jg hdr(host) -i kpserv.mooo.com
    acl host_jg hdr(host) -m end .tzuiop.net

    acl host_ri hdr(host) -i rbserv.mooo.com
    acl host_ri hdr(host) -m end .richardbeyer.org

    use_backend ri_http_server if host_ri
    use_backend jg_http_server if host_jg


frontend http_in_ssl
    bind *:443
    mode tcp

    tcp-request inspect-delay 5s
    tcp-request content accept if { req_ssl_hello_type 1 }

    default_backend bk_ssl_default

# Using SNI to take routing decision
backend bk_ssl_default
    mode tcp
    no option checkcache
    no option httpclose

    tcp-request inspect-delay 5s
    tcp-request content accept if { req.ssl_hello_type 1 }
    tcp-request content reject

    acl app_jo req_ssl_sni -m end .tzuiop.net
    acl app_jo_1 req_ssl_sni -m end kpserv.mooo.com
    acl app_ri_1 req_ssl_sni -i rbserv.mooo.com
    acl app_ri req_ssl_sni -m end .richardbeyer.org

    use-server server_jo if app_jo or app_jo_1
    use-server server_ri if app_ri or app_ri_1

    option ssl-hello-chk
    server server_jo 192.168.188.84:443 check id 1 weight 0
    server server_ri 192.168.188.90:443 check id 2 weight 0

backend ri_http_server
    mode    http
    server s1 192.168.188.90

backend jg_http_server
    mode    http
    server s2 192.168.188.84
```