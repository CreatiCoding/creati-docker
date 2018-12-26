FROM nginx
EXPOSE 3000 
RUN mkdir -p /var/logs/custom/nginx
RUN touch /var/logs/custom/nginx/access.log
COPY ./app/nginx.conf /etc/nginx/nginx.conf
