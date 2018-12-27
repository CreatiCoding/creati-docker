FROM node:6
COPY ./app/package.json /src/package.json
RUN  cd /src; npm install
COPY ./app /src
EXPOSE 3000
WORKDIR /src

CMD node index.js
