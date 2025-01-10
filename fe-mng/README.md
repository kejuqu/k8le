
# README

# nginx 站点配置文件

## mac 打包前端资源并配置nginx

```shell
# mac(install nginx by homebrew)
brew info nginx
/usr/local/etc/nginx/nginx.conf # 一般 mac 的 nginx配置文件在这里

# 前端根目录
npm run build

# /usr/local/etc/nginx/nginx.conf
server {
    listen 80;
    server_name localhost;  # 你的服务器域名或 IP （本地可以直接使用 localhost 即可）

    root /usr/local/Cellar/nginx/1.23.3/html/demo;  # 内容为前端打包后的 dist 内容

    index index.html;  # 入口文件

    location / {
        try_files $uri $uri/ /index.html;
        index index.html;
    }
}

# 保存后 检查 nginx 配置是否正常
> nginx -t
nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax is ok
nginx: configuration file /usr/local/etc/nginx/nginx.conf test is successful


# 前端项目根目录, 将前端的打包内容（dist下的所有文件）复制到 /usr/local/Cellar/nginx/1.23.3/html/demo 中
cp -r ./dist/* /usr/local/Cellar/nginx/1.23.3/html/demo

# nginx 服务重启
nginx -s reload
```

## 服务器（centos为例）

```shell
# 开发机器链接服务器，如 ssh 链接服务器 192.168.31.xx 是你的服务器 ip地址
> ssh root@192.168.31.xx

# centos(服务器)
> sudo find / -name nginx.conf
/etc/nginx/nginx.conf
> cat /etc/nginx/nginx.conf
include /etc/nginx/conf.d/*.conf; # 这一行说明 所有 /conf.d/xx.conf 的文件都会被加载到 nginx.conf 文件中
root /usr/share/nginx/html # 这一行是前端的资源文件

# 配置 nginx
> echo "server {
    listen       8080;
    listen       [::]:8080;
    server_name  localhost 127.0.0.1;

    root /usr/share/nginx/html/max_intl_react;

    index index.html;  # 入口文件

    location / {
        # try_files $uri $uri/ /index.html;
        index index.html;
    }
}" > /etc/nginx/conf.d/max_intl_react.conf #  max_intl_react.conf 方便记忆，max_intl_react为当前项目的名字
# 检查配置是否正常
nginx -t

# 开发机器将 dist 下的所有内容拷贝到 root@192.168.31.xx 的 /usr/share/nginx/html/max_intl_react 中
> scp ./dist/* root@192.168.31.xx:/usr/share/nginx/html/max_intl_react

# centos(服务器)
> sudo systemctl start nginx
Failed to start nginx.service: Unit nginx.service not found. # 使用如下命令解决该错误
> echo "[Unit]
Description=nginx - high performance web server
After=syslog.target network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t
ExecStart=/usr/sbin/nginx
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target" >> /etc/systemd/system/nginx.service
> sudo systemctl daemon-reload

> sudo systemctl restart nginx
# 检查是否验配置其作用（服务器打开）
http://127.0.0.1:8080

```
