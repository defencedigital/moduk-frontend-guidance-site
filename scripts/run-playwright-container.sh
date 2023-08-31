#!/usr/bin/env bash
set -e

CONTAINER_RUNNER="${CONTAINER_RUNNER:-podman}"
PLAYWRIGHT_VERSION=$(scripts/get-playwright-version.sh)
VOLUME_ARGS=${PLAYWRIGHT_CONTAINER_VOLUME_ARGS:--v "$(pwd)":/work/ -v /work/node_modules}

$CONTAINER_RUNNER run --rm $VOLUME_ARGS -w /work/ -it -e CI mcr.microsoft.com/playwright:"${PLAYWRIGHT_VERSION}-jammy" "$@"
