var express = require('express');
var router = express.Router();
const print = require('../util/print');
let variables = require('../util/variables');
var licenseKey = require('license-key-gen');

var dataHelper = require('../db/datahelper');
var model_lic_demo = require('../db/model/demo');

//  var browserInfo = require('browser-info');
var ua_parser = require('ua-parser');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

const crossCryto = require('../util/crossCrypto');
const mailhelper = require('../email/mailhelper');
var validator = require('email-validator');

///Api para hacer la solicitud de una licencia desde la pagina web
router.post('/api/portal/demo', async function (req, res, next) {

  let process_step = 'Validación de datos';

  try {
    //print.log(req.headers);
    let userAgent_uap = ua_parser.parse(req.headers[ 'user-agent' ]);
    // print.info(userAgent_uap);
    let token_auth = req.headers[ variables.token_auth_name ];

    if (!token_auth)
      token_auth = req.body[ variables.token_auth_name ];

    if (!token_auth) {
      res.status(400);
      res.send('UNAUTH_REQUEST #1');
      return;
    }

    if (token_auth != variables.token_auth_web_value && token_auth != variables.token_auth_win_value) {
      res.status(400);
      res.send('UNAUTH_REQUEST #2');
      return;
    }

    let nombre = req.body[ 'name' ];
    let apellido = req.body[ 'lastname' ];
    let empresa = req.body[ 'company' ];
    let correo = req.body[ 'email' ];
    let rtn = req.body[ 'rtn' ];

    if (!rtn)
      rtn = '';

    if (!apellido)
      apellido = '';

    if (!empresa)
      empresa = '';

    if (!nombre || !correo) {
      res.status(400);
      res.send('FILLDATA_REQUEST');
      return;
    }

    if (!validator.validate(correo)) {
      res.status(400);
      res.send('El correo electrónico tiene un formato incorrecto.');
      return;
    }

    // print.info("Generando licencia");

    var userData =
    {
      company: empresa,
      email: correo,
      contact: nombre + " " + apellido,
      Lic: uuidv4(),
      street: "",
      city: "",
      state: "",
      zip: ""
    };

    var licenseData =
    {
      info: userData,
      prodCode: "KAZ100120",
      appVersion: variables.latest_version,
      osType: 'WIN7'
    };

    process_step = 'generar licencia';
    var license = licenseKey.createLicense(licenseData);
    // print.log(license);

    let lic = new model_lic_demo();

    lic.License = license.license; //Licencia Id

    lic.ClientId = uuidv5(correo, uuidv5.DNS).toUpperCase().split('-')[ 0 ]; //Cliente Id

    lic.Name = nombre;
    lic.LastName = apellido;
    lic.Company = empresa;
    lic.Email = correo;
    lic.Token = '';
    lic.active = true,

      // print.log(lic);


      print.log("Guardando licencia en bdd");

    //Guardar log de actualizacion    
    process_step = 'guardar licencia';
    const saved = await dataHelper.GenerarDemoLic(lic, userAgent_uap);

    process_step = 'Generar código off-line';
    const str_secure_license_code = crossCryto.Encrypt(JSON.stringify(saved), variables.token_secure_key_lic_encrypt);

    // print.info("codigo activacion :");
    // print.info(str_secure_license_code);    

    var resultado =
    {
      Lic: saved.License,
      ClientId: lic.ClientId,
      Token: str_secure_license_code
    };

    //Crear o actualizar registro de la empresa
    if (saved) {

      const company = { clientId: lic.ClientId, email: correo, company: empresa, phone: '', rnt: rtn, address: '', name: nombre, lastname: apellido };
      process_step = 'Crear/actualizar empresa';
      dataHelper.CreateOrUpdateCompany_ByEmail(company, userAgent_uap);
    }

    print.log("Enviando correo");
    process_step = 'Envío de correo';
    mailhelper.SendRequestLicenseEmail(nombre, apellido, empresa, correo, rtn, resultado.Lic, resultado.ClientId, resultado.Token);

    res.send(resultado);
  }
  catch (error) {

    const msgError = 'Ha ocurrido un error en el siguiente proceso : ' + process_step;
    console.info(msgError);
    console.error(error);
    dataHelper.SaveErrorAndReturn(error, msgError);
    res.status(400).send(msgError);
  }
});

///Api para obtener el código o token de activación basado en el núm. de licencia y código de cliente
router.get('/api/portal/activation_code', async function (req, res, next) {

  let process_step = 'Verificación de accesos';
  try {

    let userAgent_uap = ua_parser.parse(req.headers[ 'user-agent' ]);

    let token_auth = req.headers[ variables.token_auth_name ];
    if (!token_auth)
      token_auth = req.body[ variables.token_auth_name ];

    if (!token_auth) {
      res.status(400);
      res.send('Petición denegada');
      return;
    }

    if (token_auth != variables.token_auth_web_value && token_auth != variables.token_auth_win_value) {
      res.status(400);
      res.send('Petición denegada');
      return;
    }

    let licencia = req.headers[ 'input_license' ];
    let clientId = req.headers[ 'input_client' ];

    if (!licencia) {
      res.status(400);
      res.send('Ingresar código de licencia');
      return;
    }

    if (!clientId) {
      res.status(400);
      res.send('Ingresar código de cliente');
      return;
    }

    process_step = 'Buscar licencia'
    let demo = require('../db/model/demo');
    let query = { License: licencia, ClientId: clientId, Disabled: false, Applied: false };
    let result = await demo.find(query).select('-UserAgent').select('-_id').select('-__v');

    if (!result || result.length <= 0) {
      res.status(400);
      res.send('Licencia o código de cliente incorrectos.');
      return;
    }

    process_step = 'Generar token'
    let info = result[ 0 ];
    let str_secure_license_code = crossCryto.Encrypt(JSON.stringify(info), variables.token_secure_key_lic_encrypt);

    res.send(str_secure_license_code);
  }
  catch (error) {
    const msgError = 'Ha ocurrido un error en el siguiente proceso : ' + process_step;
    console.info(msgError);
    console.error(error);
    dataHelper.SaveErrorAndReturn(error, msgError);
    res.status(400).send(msgError);
  }
});

///Api para actualizar la información de la pc y empresa en la que fue activada la aplicación
router.post('/api/portal/activation_code_apply', async function (req, res, next) {

  let process_step = 'Verificación de accesos';

  try {
    //print.log(req.headers);
    let userAgent_uap = ua_parser.parse(req.headers[ 'user-agent' ]);
    //print.info(userAgent_uap);

    let token_auth = req.headers[ variables.token_auth_name ];
    if (!token_auth)
      token_auth = req.body[ variables.token_auth_name ];

    if (!token_auth) {
      res.status(400);
      res.send('Petición denegada');
      return;
    }

    if (token_auth != variables.token_auth_web_value && token_auth != variables.token_auth_win_value) {
      res.status(400);
      res.send('Petición denegada');
      return;
    }

    if (!req.body) {
      res.status(400);
      res.send('Datos incompletos');
      return;
    }

    var info = req.body[ 0 ];

    print.info("body info api - activation_code_apply:");
    print.info(info);

    let licencia = info[ 'input_license' ];
    let clientId = info[ 'input_client' ];
    let hwid = info[ 'hwid' ];
    let pc_name = info[ 'pc_name' ];
    let system_os = info[ 'system_os' ];
    let app_version = info[ 'app_version' ];
    let app_lang = info[ 'app_lang' ];
    let start_date = info[ 'start_date' ];
    let end_date = info[ 'end_date' ];

    if (!licencia) {
      res.status(400);
      res.send('Ingresar código de licencia');
      return;
    }

    if (!clientId) {
      res.status(400);
      res.send('Ingresar código de cliente');
      return;
    }

    let demo = require('../db/model/demo');
    let query = { License: licencia, ClientId: clientId };



    print.info(query);
    process_step = 'Confirmando licencia';
    var result = await demo.updateOne(query,
      {
        $set:
        {
          Applied: true,
          Applied_date: new Date(),
          Applied_hwid: hwid,
          Applied_pc_name: pc_name,
          Applied_system_os: system_os,
          Applied_app_version: app_version,
          Applied_app_lang: app_lang,
          Applied_start_date: start_date,
          Applied_end_date: end_date
        }
      });

    // print.info(result);

    if (result && result.nModified > 0) {

      //Notificar uso de licencia
      let data = {
        license: licencia,
        clientId: clientId,
        date: new Date(),
        hwid: hwid,
        pc_name: pc_name,
        system_os: system_os,
        app_version: app_version,
        start_date: start_date,
        end_date: end_date
      };

      process_step = 'Enviando notificación';
      mailhelper.SendMessage_AppliedLicense(data);

      let lic_info = { license: licencia, clientid: clientId, hwid: hwid, computer: data };

      var log_api = {
        Api: 'portal',
        Function: 'activation_code_apply',
        Title: 'activacion_lic',
        Description: 'Licencia activada',
        Obs: '',
        ObjectInfo: lic_info
      };

      process_step = 'Histórico de consultas';
      dataHelper.SaveLog_Api(log_api, userAgent_uap);

      res.status(200);
      res.send("licencia aplicada");
    }
    else {
      res.status(400);
      return res.send("licencia no encontrada");
    }
  }
  catch (error) {
    const msgError = 'Ha ocurrido un error en el siguiente proceso : ' + process_step;
    console.info(msgError);
    console.error(error);
    dataHelper.SaveErrorAndReturn(error, msgError);
    res.status(400).send(msgError);
  }
});


///Api para devolver la información de una licencia aplicada y que pueda ser actualizada en la app winform
router.get('/api/portal/license_transform', async function (req, res, next) {

  let process_step = '';

  try {
    //print.log(req.headers);
    let userAgent_uap = ua_parser.parse(req.headers[ 'user-agent' ]);
    // print.info(userAgent_uap);

    let token_auth = req.headers[ variables.token_auth_name ];
    if (!token_auth)
      token_auth = req.body[ variables.token_auth_name ];

    if (!token_auth) {
      res.status(400);
      res.send('Petición denegada');
      return;
    }

    if (token_auth != variables.token_auth_web_value && token_auth != variables.token_auth_win_value) {
      res.status(400);
      res.send('Petición denegada');
      return;
    }

    let licencia = req.headers[ 'input_license' ];
    let clientId = req.headers[ 'input_client' ];
    let hwid = req.headers[ 'input_hwid' ];

    if (!licencia) {
      res.status(400);
      res.send('Código de licencia no ingresado');
      return;
    }

    if (!clientId) {
      res.status(400);
      res.send('Código de cliente no ingresado');
      return;
    }

    if (!hwid) {
      res.status(400);
      res.send('Identificador de maquina no ingresado');
      return;
    }

    process_step = 'Buscar licencia';
    let demo = require('../db/model/demo');
    let query = { License: licencia, ClientId: clientId, Disabled: false, Applied: true };
    let result = await demo.find(query).select('-UserAgent').select('-id');

    if (!result || result.length <= 0) {
      res.status(400);
      res.send('Licencia o código de cliente incorrectos.');
      return;
    }

    let info = result[ 0 ];

    process_step = 'Generar token';
    let str_secure_license_code = crossCryto.Encrypt(JSON.stringify(info), variables.token_secure_key_lic_encrypt);

    //Guardar log de actualizacion  
    let lic_info = { license: licencia, clientid: clientId, hwid: hwid };
    var log_api = {
      Api: 'portal',
      Function: 'license_transform',
      Title: 'terminos_lic',
      Description: 'Actualizar info. licencia',
      Obs: '',
      ObjectInfo: lic_info
    };

    process_step = 'Guardar bitacora';
    dataHelper.SaveLog_Api(log_api, userAgent_uap);

    //Respuesta al cliente
    res.send(str_secure_license_code);
  }
  catch (error) {
    const msgError = 'Ha ocurrido un error en el siguiente proceso : ' + process_step;
    console.info(msgError);
    console.error(error);
    dataHelper.SaveErrorAndReturn(error, msgError);
    res.status(400).send(msgError);
  }
});


///Api para guardar las estadisticas de uso de la app de winform
router.post('/api/portal/stats', async function (req, res, next) {

  let process_step = '';

  try {
    print.info("header data:");
    print.log(JSON.stringify(req.headers));
    print.log("\n");

    print.info("body data:");
    print.log(JSON.stringify(req.body));
    print.log("\n");

    //print.log(req.headers);
    let userAgent_uap = ua_parser.parse(req.headers[ 'user-agent' ]);
    print.info(userAgent_uap);

    if (!req.headers) {
      res.status(400);
      res.send('INVALID_CONTENT');
      return;
    }

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

    var item = req.body[ 0 ];

    print.info("Item body :");
    print.log(item);

    //Guardar log de actualizacion
    process_step = 'Guardar bitacora';
    dataHelper.CrearTrace(item, userAgent_uap);

    return res.send('Gracias por compartir sus estadísticas, al hacerlo nos ayuda a mejorar nuestro servicio.');
  }
  catch (error) {
    const msgError = 'Ha ocurrido un error en el siguiente proceso : ' + process_step;
    console.info(msgError);
    console.error(error);
    dataHelper.SaveErrorAndReturn(error, msgError);
    res.status(400).send(msgError);
  }
});

///Api para obtener cual es la ultima version de la app de winform
router.get('/api/portal/version', function (req, res, next) {

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

  res.send(variables.latest_version);
});

///Api para obtener la descripción de las actualizaciones de la ultima versión de la app de winform
router.get('/api/portal/version_features', async function (req, res, next) {

  const process_step = '';

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

    process_step = 'Generar formato';

    let msj = '<h2>HotSpot : </h2> <br>Actualizar  clave de usuario <br>Definir fecha y hora limite';
    msj = msj + '<h2>Reports : </h2> <br>Consumo de datos';
    msj = msj + '<h2>Permisos : </h2> <br>Nuevos permisos adicionales para acciones especificas dentro de una ventana';

    let json_version = {
      msj: msj,
      version: variables.latest_version,
      notas: ''
    };

    res.send(json_version);
  }
  catch (error) {

    const msgError = 'Ha ocurrido un error en el siguiente proceso : ' + process_step;
    console.info(msgError);
    console.error(error);
    dataHelper.SaveErrorAndReturn(error, msgError);
    res.status(400).send(msgError);
  }
});


module.exports = router;
