# Stage frontend
# This describes the stage frontend image, which serves the frontend
# static files, packaged by webpack.
# The build is two-stage, where we build the artifacts in a node container,
# and then only serve them using a simple busybox http server.
# Build this with e.g.: `docker build . -t stage_frontend`

FROM node:16 as builder

WORKDIR /app

# Install build dependencies up front, so that those layers can still be cached
# if just the frontend source code changes. This will only need to be rebuilt
# when the dependencies themselves change.
COPY package.json /app
COPY package-lock.json /app
RUN --mount=type=cache,target=/app/node_modules \
    npm run ci:frontend

# Copy and build the actual resulting artifacts. This places static files
# (js, html) into dist/
COPY . /app
RUN --mount=type=cache,target=/app/node_modules \
    npm run build

FROM busybox

RUN adduser -u 1000 -D stage
USER stage
WORKDIR /home/stage

# For now, we only need the static/ subdirectory. There are other artifacts
# available too, such as /app/dist/appData, but they are currently
# not required.
COPY --from=builder /app/dist/static /home/stage/static

# -f = nodaemon
# -p 8188 = listen on port 8188, all interfaces
CMD ["busybox", "httpd", "-f", "-p", "8188"]
