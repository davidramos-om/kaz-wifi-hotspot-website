
const amb = require('./util/enum');

module.exports = Object.freeze({
    host: '0.0.0.0',
    PORT: process.env.PORT || 4000,
    ENV: process.env.NODE_ENV || amb.ENVIROMENT.prod,
    printLog: true,
    version: '21.10.03.1550',
    email: {
        sendEmails: true,
        // sendGrid_api_key: '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',
        sendGrid_api_key: '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',
        sendGrid_user: 'davidramos015',
        sendGrid_key: 'MvJe+E7y5E@9UgJ',
    },
    db: {
        dev: {
            server: '127.0.0.1',
            database: 'kaz-wifi',
            user: 'root',
            pass: '',
            port: 27017
        },
        prod: {
            server: 'cluster0.dwjdg.mongodb.net',
            database: 'website',
            user: 'kaz-usr',
            pass: 'rf3t4BC444.',
            port: 27017
        }
    }
})