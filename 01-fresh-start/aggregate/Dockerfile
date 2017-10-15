FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
ADD dist /usr/src/app/dist

ADD startup.sh /usr/bin/
CMD ["/usr/bin/startup.sh"]

