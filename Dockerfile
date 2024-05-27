# Build stage
FROM registry.access.redhat.com/ubi8/nodejs-18:1-110 AS builder

USER root
WORKDIR /app-build

COPY package.json /app-build/
COPY package-lock.json /app-build/
RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 && npm ci

COPY . /app-build
RUN npm run build

# Copy to the RedHat Nginx image
FROM registry.access.redhat.com/ubi8/nginx-120:1-137

RUN rm -r "${HOME}/nginx-start/"

COPY --from=builder /app-build/dist "${HOME}"

COPY nginx/startup.sh /opt/app-root/startup.sh
COPY nginx/nginx.conf "${NGINX_CONF_PATH}"
COPY nginx/conf/server/*.conf "${NGINX_DEFAULT_CONF_PATH}"
COPY nginx/conf/http/*.conf "${NGINX_CONFIGURATION_PATH}"
COPY nginx/conf/include/*.conf "${NGINX_APP_ROOT}/etc/include/"

CMD /opt/app-root/startup.sh
