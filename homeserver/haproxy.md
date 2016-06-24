# haproxy.cfg

```
# /etc/haproxy/haproxy.cfg 
global
        maxconn 256
        chroot /var/lib/haproxy
        stats socket /run/haproxy.sock mode 660 level admin
        stats timeout 30s
        user root
        group root
        daemon

defaults
        log     global
        mode    http
        option  httplog
        option  dontlognull
        option  forwardfor
        option  http-server-close
        option redispatch
        timeout connect 5000
        timeout client  50000
        timeout server  50000
        errorfile 400 /etc/haproxy/errors/400.http
        errorfile 403 /etc/haproxy/errors/403.http
        errorfile 408 /etc/haproxy/errors/408.http
        errorfile 500 /etc/haproxy/errors/500.http
        errorfile 502 /etc/haproxy/errors/502.http
        errorfile 503 /etc/haproxy/errors/503.http
        errorfile 504 /etc/haproxy/errors/504.http

frontend http-in
        bind *:80
        acl host_ri hdr(host) -i rbserv.mooo.com
        acl host_jg hdr(host) -i kpserv.mooo.com
        acl host_jg hdr(host) -i tzuiop.net
        acl host_jg hdr(host) -i www.tzuiop.net
 
        use_backend ri_http_server if host_ri
        use_backend jg_http_server if host_jg

frontend ssl_relay 
      bind *:443
      mode tcp
      option socket-stats
      maxconn  300
      tcp-request inspect-delay 5s
      tcp-request content accept if { req_ssl_hello_type 1 }

      use_backend ssl_domain_ri if { req_ssl_sni -i rbserv.mooo.com }
      use_backend ssl_domain_jg if { req_ssl_sni -i kpserv.mooo.com }
      use_backend ssl_domain_jg if { req_ssl_sni -i tzuiop.net }
      use_backend ssl_domain_jg if { req_ssl_sni -i www.tzuiop.net }

      default_backend ssl_domain_jg

backend ssl_domain_jg
      mode tcp
      balance roundrobin
      hash-type consistent
      option srvtcpka
      stick-table type binary len 32 size 30k expire 30m

      # make sure we cover type 1 (fallback)
      acl clienthello req_ssl_hello_type 1
      acl serverhello rep_ssl_hello_type 2

      # use tcp content accepts to detects ssl client and server hello.
      tcp-request inspect-delay 5s
      tcp-request content accept if clienthello

      # no timeout on response inspect delay by default.
      tcp-response content accept if serverhello

      # SSL session ID (SSLID) may be present on a client or server hello.
      # Its length is coded on 1 byte at offset 43 and its value starts
      # at offset 44.
      # Match and learn on request if client hello.
      stick on payload_lv(43,1) if clienthello

      # Learn on response if server hello.
      stick store-response payload_lv(43,1) if serverhello

      server s_jo 192.168.188.84:443


backend ssl_domain_ri
        mode tcp
        #option tcplog
        balance roundrobin
        hash-type consistent
        option srvtcpka

        # maximum SSL session ID length is 32 bytes.
        stick-table type binary len 32 size 30k expire 30m

        # make sure we cover type 1 (fallback)
        acl clienthello req_ssl_hello_type 1
        acl serverhello rep_ssl_hello_type 2

        # use tcp content accepts to detects ssl client and server hello.
        tcp-request inspect-delay 5s
        tcp-request content accept if clienthello

        # no timeout on response inspect delay by default.
        tcp-response content accept if serverhello

        # SSL session ID (SSLID) may be present on a client or server hello.
        # Its length is coded on 1 byte at offset 43 and its value starts
        # at offset 44.
        # Match and learn on request if client hello.
        stick on payload_lv(43,1) if clienthello

        # Learn on response if server hello.
        stick store-response payload_lv(43,1) if serverhello

        #option ssl-hello-chk

        server s_ri 192.168.188.90:443


backend ri_http_server
        balance roundrobin
        option httpclose
        option forwardfor
        server s1 192.168.188.90 maxconn 32

backend jg_http_server
        balance roundrobin
        option httpclose
        option forwardfor
        server s2 192.168.188.84 maxconn 32
```