const print = require('../util/print');
const cf = require('../config');
const env = require('../util/enum');

function _getMongoURL()
{

    if (cf.ENV === env.ENVIROMENT.prod)
    {

        const url = `mongodb+srv://${cf.db.prod.user}:${cf.db.prod.pass}@${cf.db.prod.server}/${cf.db.prod.database}?retryWrites=true&w=majority`;
        return url;
    }

    if (cf.ENV === env.ENVIROMENT.dev)
    {
        const url = `mongodb://${cf.db.dev.server}:${cf.db.dev.port}/?compressors=zlib&readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass&ssl=false`;
        return url;
    }


    print.info(" Conectando con Mongo -> " + url);
    return '';
}


module.exports = {
    GetMongoURL: _getMongoURL
};