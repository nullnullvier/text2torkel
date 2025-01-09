# build step
FROM node:current-alpine3.20 AS builder

WORKDIR /app

COPY package* ./

#cheesy workaorund to speed up the npm build
RUN npm config set strict-ssl false
RUN npm ci --prefer-offline --no-audit
RUN npm cache clean --force
COPY . .
RUN npm run build
COPY . .
# python step
FROM python:3.11-slim-bookworm AS release
RUN apt update -y && apt upgrade -y && apt install -y libportaudio2 libasound-dev alsa-utils acl
COPY ./.devcontainer/asound.conf /etc/asound.conf 
WORKDIR /app
COPY . .
COPY --from=builder /app/dist /usr/share/nginx/html/

RUN pip3 install -r api/requirements.txt

EXPOSE 8080
CMD ["python3", "./api/app.py", "--device=/dev/snd"]