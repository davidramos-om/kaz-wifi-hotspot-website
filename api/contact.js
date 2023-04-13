var express = require('express');
var router = express.Router();
var print = require('../util/print');
var variables = require('../util/variables');

var dataHelper = require('../db/datahelper');
var ua_parser = require('ua-parser');

var uuidv4 = require('uuid/v4');
var mailhelper = require('../email/mailhelper');
var validator = require('email-validator');

router.post('/api/contact/message', async function (req, res, next) {
    let process_step = 'validación de datos';

    try {
        let token_auth = req.headers[ variables.token_auth_name ];
        if (!token_auth)
            token_auth = req.body[ variables.token_auth_name ];

        if (!token_auth) {
            res.status(400);
            res.send('UNAUTH_REQUEST');
            return;
        }

        if (token_auth != variables.token_auth_web_value && token_auth != variables.token_auth_win_value) {
            res.status(400);
            res.send('UNAUTH_REQUEST');
            return;
        }

        // print.info("body");
        // print.info(req.body);

        const contact = req.body[ 'contact' ];
        const empresa = req.body[ 'company' ];
        const correo = req.body[ 'email' ];
        const mensaje = req.body[ 'message' ];
        const phone = req.body[ 'phone' ];

        if (!contact || !empresa || !correo || !mensaje) {
            res.status(400);
            res.send('Debe completar todos los datos del formulario.');
            return;
        }

        if (!validator.validate(correo)) {
            res.status(400);
            res.send('El correo electrónico tiene un formato incorrecto.');
            return;
        }

        if (!phone)
            phone = '';

        const record = {
            Contact: contact,
            Company: empresa,
            Email: correo,
            Phone: phone,
            Message: mensaje,
            Active: true,
            Code: uuidv4().toUpperCase().split('-')[ 0 ]
        };

        //Guardar log de actualizacion
        const userAgent_uap = ua_parser.parse(req.headers[ 'user-agent' ]);

        //Guardar mensaje
        process_step = 'Guardar mensaje';
        await dataHelper.SaveContactMessage(record, userAgent_uap);

        //Enviar correo de confirmacion
        process_step = 'Envío del mensaje';
        await mailhelper.SendContactMessageEmail(record);

        res.send('Hemos recibido su mensaje y enviado una copia a su correo electrónico...');

    } catch (error) {

        const msgError = 'Ha ocurrido un error en el siguiente proceso : ' + process_step;
        console.info(msgError);
        console.error(error);
        dataHelper.SaveErrorAndReturn(error, msgError);
        res.status(400).send(msgError);
    }
});


module.exports = router;