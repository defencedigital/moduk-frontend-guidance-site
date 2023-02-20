# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-18:latest AS builder

USER root

COPY . /app-build
WORKDIR /app-build

RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci
RUN npm run build

# Copy to the RedHat Nginx image
FROM registry.access.redhat.com/ubi9/nginx-120:latest

COPY --from=builder /app-build/dist "${HOME}"

ADD nginx/startup.sh /opt/app-root/startup.sh
ADD nginx/logging.conf "${NGINX_CONFIGURATION_PATH}"
ADD nginx/misc-http-section.conf "${NGINX_CONFIGURATION_PATH}"
ADD nginx/owasp-http-section.conf "${NGINX_CONFIGURATION_PATH}"
ADD nginx/owasp-server-section.conf "${NGINX_DEFAULT_CONF_PATH}"
ADD nginx/assets-server-section.conf "${NGINX_DEFAULT_CONF_PATH}"
COPY nginx/common-server-section.conf "${NGINX_APP_ROOT}/etc/include/"

CMD /opt/app-root/startup.sh
