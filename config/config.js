'use strict';

// required environment variables
let env_variables = ['NODE_ENV', 'PORT'];
env_variables.forEach((name) => {
    if (!process.env[name]) {
        throw new Error(`Environment variable ${name} is missing`);
    }
})

const config = {
    env: process.env.NODE_ENV,
    logger: {
        level: process.env.LOG_LEVEL || 'info',
        enabled: process.env.BOOLEAN ? process.env.BOOLEAN.toLowerCase() === 'true' : false
    },
    server: {
        port: Number(process.env.PORT)
    }
};

module.exports = config;