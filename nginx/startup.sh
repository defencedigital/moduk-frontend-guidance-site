#!/bin/sh

echo "Starting Nginx"
echo "=============="
echo ""
echo "Is Prod : $IS_PROD"
echo "Allow list : $ALLOW_LIST"

# If this is not prod, create the allow list
if [ "$IS_PROD" = 'false' ]; then
  echo "Not production - implementing allow list"
  echo $ALLOW_LIST | base64 -d > /opt/app-root/etc/nginx.default.d/allow-list.conf
fi

nginx -g 'daemon off;'