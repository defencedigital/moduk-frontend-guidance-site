# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-22@sha256:22130efa6b3d680a9cd11bb7a414fa3815a7e5b7d353c8ebaa7512387f52c09a AS builder

USER root
WORKDIR /app-build

COPY package.json /app-build/
COPY package-lock.json /app-build/

RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 && npm i

COPY . /app-build
RUN npm run build

# Copy to the RedHat Nginx image
FROM registry.access.redhat.com/ubi9/nginx-120@sha256:2838ce373b81cff340e89b5fdbf4f0fab93585d1df51753a60cb98b8a7595e75

RUN rm -r "${HOME}/nginx-start/"

COPY --from=builder /app-build/dist "${HOME}"

COPY nginx/startup.sh /opt/app-root/startup.sh
COPY nginx/nginx.conf "${NGINX_CONF_PATH}"
COPY nginx/conf/server/*.conf "${NGINX_DEFAULT_CONF_PATH}"
COPY nginx/conf/http/*.conf "${NGINX_CONFIGURATION_PATH}"
COPY nginx/conf/include/*.conf "${NGINX_APP_ROOT}/etc/include/"

CMD /opt/app-root/startup.sh
