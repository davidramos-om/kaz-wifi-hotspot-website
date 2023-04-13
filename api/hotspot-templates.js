var express = require('express');
const https = require('https');
var router = express.Router();
var variables = require('../util/variables');

var dataHelper = require('../db/datahelper');


router.get('/api/win/templates', async function (req, res) {
    let process_step = 'Verificación de accesos';

    try {

        let token_auth = req.headers[ variables.token_auth_name ];
        if (!token_auth)
            token_auth = req.body[ variables.token_auth_name ];

        if (!token_auth) {
            res.status(400);
            res.send({ error: 'Petición denegada' });
            return;
        }

        if (token_auth != variables.token_auth_web_value && token_auth != variables.token_auth_win_value) {
            res.status(400);
            res.send({ error: 'Petición denegada' });
            return;
        }

        const outer_app_id = req.headers[ 'input_outer_app_id' ];

        if (!outer_app_id) {
            res.status(400);
            res.send({ error: 'Código de app incorrecto' });
            return;
        }

        process_step = 'Obtener plantillas';

        const offset = req.query.offset || req.headers[ 'offset' ] || req.body[ 'offset' ] || 0;
        const limit = req.query.limit || req.headers[ 'limit' ] || req.body[ 'limit' ] || 30;
        const sort = req.query.sort || req.headers[ 'sort' ] || req.body[ 'sort' ] || -1;
        const keyword = req.query.keyword || req.headers[ 'keyword' ] || req.body[ 'keyword' ] || '';

        const url = variables.api_url + `/portal/hotspot/templates?offset=${offset}&limit=${limit}&sort=${sort}&keyword=${keyword}`;

        https.get(url, (resp) => {

            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {

                if (!data) {
                    res.status(200);
                    res.send({ templates: [] });
                    return;
                }

                const templates = JSON.parse(data);
                if (templates && templates.statusCode && templates.statusCode != 200) {
                    res.status(400);
                    res.send({ error: templates.message });
                    return;
                }

                if (templates && templates.length > 0) {

                    const curated_templates = templates.map((t) => {

                        t.id = t._id || '';
                        delete t.reason;
                        delete t.deleted_by;
                        delete t.deleted_at;
                        delete t.created_by;
                        delete t.created_at;
                        delete t.updated_by;
                        delete t.updated_at;
                        delete t.active;
                        delete t.__v;
                        delete t._id;

                        return t;
                    });

                    res.status(200);
                    res.send({ templates: curated_templates });
                    return;
                }

                res.status(200);
                res.send({ templates: [] });
            });

        }).on("error", (err) => {
            const msgError = 'Ha ocurrido un error en el siguiente proceso : ' + process_step;
            res.status(400).send({ error: msgError });
        });
    }
    catch (error) {
        const msgError = 'Ha ocurrido un error en el siguiente proceso : ' + process_step;
        console.info(msgError);
        console.error(error);
        dataHelper.SaveErrorAndReturn(error, msgError);
        res.status(400).send({ error: msgError });
    }
});


module.exports = router;