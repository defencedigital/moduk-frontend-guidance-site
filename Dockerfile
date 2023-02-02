# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-18:latest AS builder

USER root

COPY . /app-build
WORKDIR /app-build

RUN npm ci
RUN npm run build

# Copy to the RedHat Nginx image
FROM registry.access.redhat.com/ubi9/nginx-120:latest

COPY --from=builder /app-build/dist "${HOME}"

ADD nginx/startup.sh /opt/app-root/startup.sh
ADD nginx/logging.conf "${NGINX_CONFIGURATION_PATH}"
ADD nginx/owasp-http-section.conf "${NGINX_CONFIGURATION_PATH}"
ADD nginx/owasp-server-section.conf "${NGINX_DEFAULT_CONF_PATH}"

CMD /opt/app-root/startup.sh
