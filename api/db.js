var express = require('express');

var router = express.Router();
var variables = require('../util/variables');

var dataHelper = require('../db/datahelper');

router.get('/api/db/reconnect', async function (req, res) {
    let process_step = 'Verificación de accesos';

    try {

        let pass_key = req.query[ 'pass_key' ];

        if (!pass_key) {
            res.status(400);
            res.send({ error: 'Petición denegada 1' });
            return;
        }

        if (pass_key !== variables.db_pass_key) {
            res.status(401);
            res.send({ error: 'Petición denegada 2' });
            return;
        }

        process_step = 'Reconectar a la base de datos';
        console.info(`\n💥 Reconectar a la base de datos  👍`);
        dataHelper.ConnectToDB();
        res.status(200);
        res.send({ success: 'Petición de conexión realizada' });
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