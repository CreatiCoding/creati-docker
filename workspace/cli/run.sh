docker build --tag creati-docker:node ./node
docker build --tag creati-docker:nginx ./nginx
docker run -d --name creati-docker-node-instance -p 3000:3000 creati-docker:node
docker run -d --name creati-docker-nginx-instance -p 4000:80 creati-docker:nginx
