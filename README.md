# creati-docker

creati-docker

## [Go to develop branch](https://github.com/CreatiCoding/creati-docker/tree/develop)



## openssl, NginX, Node.js, express, docker 로 https localhost 구현



### 0. 도커로 /bin/sh 접속하기

```bash
$ docker exec -it [contianerID] /bin/sh
# docker exec -it cadc72d1fef2 /bin/sh
```



### 1. 도커로 node 구현

```bash
mkdir app
cd app
npm init -f
npm i --save express uuid
cd ..
```

> node/app/index.js

```js
// 디팬던시
var express = require('express');
var uuid = require('uuid');

var app = express();
var id = uuid.v4();
var port = 3000;

app.get('/', function (req, res) {
  res.send(id)
});

app.listen(port, function () {
  console.log('Example app listening on port: ' + port);
});
```

> node/ 에서

```bash
$ node app/index.js
```

> node/.dockerignore

```
node_modules/
```

> node/Dockerfile

```dockerfile
FROM node:6
COPY ./app/package.json /src/package.json
RUN  cd /src; npm install
COPY ./app /src
EXPOSE 3000
WORKDIR /src

CMD node index.js
```

> node/ 에서

```bash
$ docker build --tag creati-docker:node .
```

> anywhere

```bash
$ docker images
```

```bash
$ docker run --name creati-docker-node-instance -p 3000:3000 creati-docker:node
```



### 2. 도커로 nginx 구현

> nginx/app/nginx.conf

```nginx
events { worker_connections 1024; }

http {
  upstream node-app {
    server localhost:3000 max_fails=3 fail_timeout=30s;
  }

  server {
    listen 80;

    location / {
      proxy_pass http://node-app;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
  }
}
```

> nginx/Dockerfile

```dockerfile
FROM nginx
COPY ./app/nginx.conf /etc/nginx/nginx.conf
```

> nginx/ 에서

```bash
$ docker build --tag creati-docker:nginx .
```

> anywhere

```bash
$ docker images
```

> nginx/ 에서

```bash
$ docker run -d --name creati-docker-nginx-instance -p 4000:80 creati-docker:nginx
```

- openssl 로컬에서의 발급 절차

```bash
openssl genrsa -des3 -out private.key 2048
openssl rsa -in private.key -out key.pem
openssl req -new -key private.key -out out.csr -config "/usr/local/etc/openssl/openssl.cnf"
openssl req -key private.key -x509 -nodes -sha1 -days 365 -in out.csr -out crt.pem
ls
# result: private.key, key.pem, out.crs, crt.pem
# will use: key.pem, crt.pem
```

- 바뀐 nginx 설정

```nginx
worker_processes 4;

events { worker_connections 1024; }

http {

  log_format access_log_format '$remote_addr - $remote_user [$time_local] '
                           '"$request" $status $body_bytes_sent '
                           '"$http_referer" "$http_user_agent" "$gzip_ratio"';

  upstream node-app {
    server node:3000 max_fails=3 fail_timeout=30s;
  }

  server {

    listen 80;
    listen 443 ssl;

    gzip on;
    access_log /var/logs/custom/nginx/access.log access_log_format;

    server_name creco;
    ssl_certificate /var/etc/openssl/crt.pem;
    ssl_certificate_key /var/etc/openssl/newkey.pem;

    location / {
      proxy_pass http://node-app;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
  }
}
```

