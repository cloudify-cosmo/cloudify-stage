module.exports = {
  apps : [{
    name: 'stage-backend',
    script: 'server.js',
    args: process.env.STAGE_BACKEND_ARGS,

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 0,
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_development: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },

    output: '/var/log/cloudify/stage/server-output.log',
    error: '/var/log/cloudify/stage/server-errors.log'
  }]
};
