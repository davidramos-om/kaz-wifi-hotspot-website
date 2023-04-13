const mongoose = require('mongoose');
const fs = require('fs');
const print = require('../util/print');
const dbcf = require('./db');
const mailhelper = require('../email/mailhelper');

const saveTotalBody = false;

//Models
const model_trace = require('./model/trace');
const model_demoLic = require('./model/demo');
const model_contact_message = require('./model/contact_message');
const model_log_api = require('./model/log_api');
const company_model = require('../db/model/company');

let ReconnectRequest = false;
const max_reconnect_attempts = 5;
let reconnect_attempts = 0;
const dbConnectionString = dbcf.GetMongoURL();
mongoose.Promise = global.Promise;

mongoose
    .connect(dbConnectionString, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(res => console.log('Connected to DB'))
    .catch((err) => {
        console.log("MongoDb Error : ", err);
    });

var db = mongoose.connection;

db.on('error', (err) => {
    console.log('DB connection error', err);
});

db.on('connected', function () {
    print.info('Conectado con mongo DB');

    if (!ReconnectRequest)
        return;

    ReconnectRequest = false;
    reconnect_attempts = 0;
    console.log('Reconnected to DB - send email : ');
    mailhelper.sendDbReconnectedEmail();
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected!');

    if (ReconnectRequest)
        return;

    mailhelper.SendDBDisconnectedEmail();
    if (reconnect_attempts < max_reconnect_attempts)
        ReconectToDB();
});

function ReconectToDB() {

    try {
        if (!db)
            return;

        if (db.readyState !== 0)
            return;

        console.log('\n 😩 MongoDB disconnected!...Reconnecting to DB 😉');
        ReconnectRequest = true;

        //Just for test
        // if (reconnect_attempts === 0)
        //     db.close();

        reconnect_attempts++;
        mongoose
            .connect(dbConnectionString, { useUnifiedTopology: true, useNewUrlParser: true })
            .then(res => console.log('Connected to DB'))
            .catch((err) => {
                console.log("MongoDb Error : ", err);
            });
    }
    catch (error) {
        console.log(`🐛 -> 🔥 ReconectToDB 🔥 error : `, error);
    }
}

module.exports =
{
    ConnectToDB: ReconectToDB,

    SaveErrorAndReturn(error, message) {
        try {
            var d = new Date().toISOString();
            const msg = '\n ' + d + ' : ' + (message ? message : 'Error') + error ? error : '';

            fs.appendFile('kaz-logo.txt', msg, function (err) {
                if (err)
                    console.error("Error on save error", err);

                console.log('Saved!');
            });

        } catch (error) {

        }

        return message;
    },

    async GenerarDemoLic(body, user_agent) {
        let item = new model_demoLic(body);
        item.DateOP = new Date();
        item.UserAgent = user_agent;

        print.info('item schema mongodb');
        print.info(item);

        const itemSave = await item.save();

        return itemSave;
    },

    async SaveContactMessage(record, user_agent) {
        let item = new model_contact_message(record);
        item.DateOP = new Date();
        item.UserAgent = user_agent;

        const itemSave = await item.save();

        return itemSave;
    },

    async SaveLog_Api(record, user_agent) {
        let item = new model_log_api(record);
        item.DateOP = new Date();
        item.Active = true;
        item.UserAgent = user_agent;

        const itemSave = await item.save();

        return itemSave;
    },

    async CreateOrUpdateCompany_ByEmail(record, user_agent) {
        // print.info("Crear o actualizar empresa :");
        // print.log(record);

        if (!record)
            return;

        if (!record.email)
            return;

        if (!record.clientId)
            record.clientId = '';

        if (!record.company)
            record.company = '';

        if (!record.phone)
            record.phone = '';

        if (!record.rtn)
            record.rtn = '';

        if (!record.address)
            record.address = '';

        if (!record.name)
            record.name = '';

        if (!record.lastname)
            record.lastname = '';



        // var item = new company_model(record);
        // let item = require('../db/model/company');

        let query = { Email: record.email, Active: true };

        var result = await company_model.updateOne(query,
            {
                $set: {
                    Company: record.company,
                    Email: record.email,
                    RTN: record.rtn,
                    Address: record.address,
                    ClientId: record.clientId,
                    Phones: record.phone,
                    Contact: record.name + ' ' + record.lastname,
                    UpdateDate: new Date()
                }
            });

        if (result && result.nModified > 0) {
            print.info("Datos de empresa actualizados");
        }
        else {
            print.log("Crear nueva empresa");

            var new_item = new company_model(
                {
                    Email: record.email,
                    Company: record.company,
                    RTN: record.rtn,
                    Address: record.address,
                    ClientId: record.clientId,
                    Phones: record.phone,
                    Contact: record.name + ' ' + record.lastname
                });

            new_item.DateOP = new Date();
            new_item.Active = true;
            new_item.UpdateDate = null;
            new_item.UserAgent = user_agent;

            // print.info("company to create :");
            // print.info(new_item);

            result = await new_item.save();
            // print.info("company saved :");
            // print.info(itemSave);
        }

        print.info("CreateOrUpdateCompany_ByEmail : ");
    },

    async CrearTrace(body, user_agent) {
        // try
        {
            let item = new model_trace(body);
            item.DateOP = new Date();
            item.UserAgent = user_agent;

            if (saveTotalBody) item.TotalBody = body;
            else item.TotalBody = '';

            print.info('item schema mongodb');
            print.info(item);

            item.save(function (err, itemSave) {
                if (err) {
                    print.error(err);
                    throw new Error(err);
                }

                print.info('Item schema : guardado');
                print.info(itemSave);
            });
        }
        // catch (error)
        // {
        //     print.error("CrearTrace.Catch :");
        //     print.error(error);
        //     throw new Error(error);
        // }
    }
};