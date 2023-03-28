#!/usr/bin/env -S bash -eux

# create all the required config files based on the container's environment
cat <<EOF > /app/conf/app.json
{
  "backend": {
    "host": "${LISTEN_HOST}"
  },
  "db": {
    "url": "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}",
    "options": {
      "dialectOptions": {
        "ssl": false
      }
    }
  },
  "maps": {
    "accessToken": ""
  }
}
EOF

cat <<EOF > /app/conf/manager.json
{
  "ip": "${RESTSERVICE_ADDRESS}",
  "apiVersion": "v3.1",
  "protocol" : "${RESTSERVICE_PROTOCOL}",
  "port": "${RESTSERVICE_PORT}"
}
EOF

mkdir -p /etc/cloudify
cat <<EOF > /etc/cloudify/logging.conf
EOF

cd /app/backend

# before running the app, let's make sure the DB is up to date.
# This is idempotent and safe to run every time the backend starts.
npm run db-migrate

exec npm run start
