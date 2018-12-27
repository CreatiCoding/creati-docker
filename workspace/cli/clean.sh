docker stop -t 0 creati-docker-node-instance
docker rm creati-docker-node-instance
docker stop -t 0 creati-docker-nginx-instance
docker rm creati-docker-nginx-instance
docker rmi creati-docker:node
docker rmi creati-docker:nginx
