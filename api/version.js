var express = require('express');
const https = require('https');
var router = express.Router();
var variables = require('../util/variables');

var dataHelper = require('../db/datahelper');


router.get('/api/apps/latest', async function (req, res) {
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

        process_step = 'Obtener ultima versión';


        const url = variables.api_url + '/portal/' + outer_app_id + '/latest/';

        https.get(url, (resp) => {

            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                if (!data) {
                    res.status(400);
                    res.send({ error: 'No se encontró la versión' });
                    return;
                }

                const lates_version = JSON.parse(data);
                if (lates_version && lates_version.statusCode && lates_version.statusCode != 200) {
                    res.status(400);
                    res.send({ error: lates_version.message });
                    return;
                }

                lates_version.id = lates_version._id || '';
                delete lates_version.reason;
                delete lates_version.deleted_by;
                delete lates_version.deleted_at;
                delete lates_version.created_by;
                delete lates_version.created_at;
                delete lates_version.updated_by;
                delete lates_version.updated_at;
                delete lates_version.active;
                delete lates_version.__v;
                delete lates_version._id;

                res.status(200);
                res.send(lates_version);
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