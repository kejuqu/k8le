server {
    listen 80;
    server_name wise-grid-dev.xiaoduoai.com;
    # 将所有HTTP请求重定向到HTTPS
    # rewrite ^(.*)$  https://wise-grid-dev.xiaoduoai.com$1 permanent;
    return 301 https://wise-grid-dev.xiaoduoai.com$request_uri;
}

server {
    listen      443 ssl;
    server_name wise-grid-dev.xiaoduoai.com;

    ssl_certificate /etc/nginx/key/xiaoduoai.crt;
    ssl_certificate_key /etc/nginx/key/xiaoduoai.key;
    ssl_protocols TLSv1.2 TLSv1.3; # 更新为包含TLSv1.3

    client_max_body_size 1024M;

    access_log /var/log/nginx/wise-grid-dev.xiaoduoai.com.log main;

    location / {
        root /usr/share/nginx/html/wise_grid;
        index index.html;
        try_files $uri $uri/ /index.html; # 依赖try_files来处理未找到的文件
    }

    location /api/user_account/ {
        proxy_pass https://enterprise-dev-lane.xiaoduoai.com/api/user_account/;
    }

    location /data-center/api {
        proxy_pass http://10.248.33.247:8071;
    }

    location /api/v1/ {
        proxy_pass http://10.0.0.171:9001;
    }

    location /superadmin/ {
        rewrite ^/superadmin/(.*)$ /$1 break; # 如果需要保持原始URI不变，请保留break
        proxy_pass http://10.0.0.171:9004;
    }

    location /channel/ {
        rewrite ^/channel/(.*)$ /$1 break; # 同上
        proxy_pass http://10.0.0.171:9002;
    }

    location /knowledge-goods/ {
        rewrite ^/knowledge-goods/(.*)$ /$1 break; # 同上
        proxy_pass http://10.0.0.171:9003;
    }

    location /backend/api {
        rewrite ^/backend/api/(.*)$ /$1 break; # 同上
        proxy_pass http://10.0.0.171:3000;
        proxy_set_header X-Original-Method $request_method;
    }

    location /api/permission/ {
        proxy_pass https://enterprise-dev-lane.xiaoduoai.com/api/permission/;
    }

    location /__enterprise__/account/ {
        proxy_pass https://enterprise-dev-lane.xiaoduoai.com/__enterprise__/account/;
    }

    location /metrics {
        proxy_pass http://10.0.0.171:8889;
    }

    location /internal/api {
        rewrite ^/internal/(.*)$ /$1 break; # 同上
        proxy_pass https://enterprise-dev-lane.xiaoduoai.com;
        proxy_set_header X-Original-Method $request_method;
    }
}