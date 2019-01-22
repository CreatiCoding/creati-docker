# creati-docker

creati-docker

## [Go to develop branch](https://github.com/CreatiCoding/creati-docker/tree/develop)

## openssl, NginX, Node.js, express, docker 로 https localhost 구현



### 0. 도커로 /bin/sh 접속하기

```
docker exec -it [contianerID] /bin/sh
# docker exec -it cadc72d1fef2 /bin/sh
```



### 1. 도커로 node 구현

```
mkdir app
cd app
npm init -f
npm i --save express uuid
cd ..
```

> node/app/index.js

```
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

```
node app/index.js
```

> node/.dockerignore

```
node_modules/
```

> node/Dockerfile

```
FROM node:6
COPY ./app/package.json /src/package.json
RUN  cd /src; npm install
COPY ./app /src
EXPOSE 3000
WORKDIR /src

CMD node index.js
```

> node/ 에서

```
docker build --tag creati-docker:node .
```

> anywhere

```
docker images
```

```
docker run --name creati-docker-node-instance -p 3000:3000 creati-docker:node
```



### 2. 도커로 nginx 구현

> nginx/app/nginx.conf

```
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
docker build --tag creati-docker:nginx .
```

> anywhere

```
docker images
```

> nginx/ 에서

```
docker run -d --name creati-docker-nginx-instance -p 4000:80 creati-docker:nginx
```







- openssl 로컬에서의 발급 절차

```
openssl genrsa -des3 -out private.key 2048
openssl req -new -key private.key -out out.csr -config "/usr/local/etc/openssl/openssl.cnf"
openssl req -key private.key -x509 -nodes -sha1 -days 365 -in out.csr -out crt.pem
openssl rsa -in private.key -out newkey.pem
```

