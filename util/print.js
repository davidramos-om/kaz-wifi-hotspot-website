// const logger = require('pino')()
const config = require('../config');

module.exports =
{
    log(text)
    {
        if (!config.printLog)
            return;

        console.info(text);
    },

    info(text)
    {
        if (!config.printLog)
            return;

        console.info(text);
    },

    error(text)
    {
        if (!config.printLog)
            return;

        console.error(text);
    }
}