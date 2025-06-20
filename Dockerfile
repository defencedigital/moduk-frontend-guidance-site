# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-22@sha256:e43ba2b1d2ca6c62978d9514b9448d96d62f4fb6b4d62307203450e54a958a03 AS builder

USER root
WORKDIR /app-build

COPY package.json /app-build/
COPY package-lock.json /app-build/

RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 && npm i

COPY . /app-build
RUN npm run build

# Copy to the RedHat Nginx image
FROM registry.access.redhat.com/ubi9/nginx-120@sha256:7780f65bb941e76560b5f6870d2bb1f6c65305c6ef56e573ed6dfafe61ded3ef

RUN rm -r "${HOME}/nginx-start/"

COPY --from=builder /app-build/dist "${HOME}"

COPY nginx/startup.sh /opt/app-root/startup.sh
COPY nginx/nginx.conf "${NGINX_CONF_PATH}"
COPY nginx/conf/server/*.conf "${NGINX_DEFAULT_CONF_PATH}"
COPY nginx/conf/http/*.conf "${NGINX_CONFIGURATION_PATH}"
COPY nginx/conf/include/*.conf "${NGINX_APP_ROOT}/etc/include/"

CMD /opt/app-root/startup.sh
