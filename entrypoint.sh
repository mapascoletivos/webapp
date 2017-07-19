#!/bin/sh

echo "Updating permissions..."
chown -Rf node:node /src /usr/local/lib/node_modules
echo "Compiling assets..."
su-exec node:node mkdir -p public && ./node_modules/.bin/napa
su-exec node:node grunt build
echo "Executing process..."
exec su-exec node:node /sbin/tini -- "$@"
