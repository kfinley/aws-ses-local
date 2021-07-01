FROM mhart/alpine-node:6.10.0

# Create app directory
RUN mkdir -p /aws-ses-local
WORKDIR /aws-ses-local

# Install app dependencies
COPY package.json /aws-ses-local
COPY .babelrc /aws-ses-local

RUN npm install --loglevel=silent

RUN mkdir -p /src

VOLUME /aws-ses-local/output
VOLUME /aws-ses-local/build/templates
VOLUME /aws-ses-local/src

ENV PORT=9001
EXPOSE 9001

CMD [ "npm", "start"]
