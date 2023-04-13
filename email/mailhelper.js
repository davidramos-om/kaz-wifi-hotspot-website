
var config = require('../config');
var variables = require('../util/variables');
var print = require('../util/print');
var app_urls = require('../util/url');

const fs = require("fs");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.email.sendGrid_api_key)

const header_path = __dirname + '/views/partials/head.hbs';
const footer_path = __dirname + '/views/partials/footer.hbs';
var header_content = '';
var footer_content = '';

fs.readFile(header_path, 'utf8', function (err, data) {
    if (err)
        return;

    header_content = data;
    // console.info("header_content", header_content);
});


fs.readFile(footer_path, 'utf8', function (err, data) {
    if (err)
        return;

    footer_content = data;
    // console.info("footer_content", footer_content);
});



const templates = {
    demo_license: "d-92029359651d4323a772a0290dca616e",
    contact_information: 'd-7e5d2a1dc9664df78fe569925373cfa3',
    applied_license: 'd-e5b167a3470c4a41b306f52c7c407fd9',
    db_disconnected: 'd-964973637f00444e9336f58b3e7b1cdd',
    db_reconnected: 'd-78553cb0ab974fa8af4def9443ea310a',
};


module.exports = {

    async SendRequestLicenseEmail(nombre, apellido, empresa, correo, rtn, license_code, clientId, license_token) {
        if (!config.email.sendEmails)
            return;

        const title = 'Licencia solicitada';

        const data = {
            MailTitle: title,
            name: nombre,
            lastname: apellido,
            company: empresa,
            identifier: rtn,
            license: license_code,
            customerId: clientId,
            token: license_token,
            url_help: app_urls.getHelpUrl(),
            url_app_download: app_urls.getDownloadAppUrl(),
            header: header_content.replace('{{MailTitle}}', title),
            footer: footer_content
        };


        const msg = {
            to: correo,
            from: variables.email_license_request,
            subject: 'Solicitud de licencia demostrativa',
            templateId: templates.demo_license,
            dynamic_template_data: data,
        };

        sgMail
            .send(msg)
            .then(() => {
                print.info('Email sent')
            })
            .catch((error) => {
                print.info(error)
            });

    },

    async SendMessage_AppliedLicense(record) {
        if (!config.email.sendEmails)
            return;

        if (!record)
            return;

        const demo = require('../db/model/demo');
        const query = { License: record.license, ClientId: record.clientId, Applied: true };
        const lic = await demo.findOne(query);

        if (!lic)
            return;

        const title = 'Notificación de uso de licencia';

        const data = {
            MailTitle: title,
            RecordData: record,
            header: header_content.replace('{{MailTitle}}', title),
            footer: footer_content
        };

        const msg = {
            to: lic.Email,
            from: variables.email_license_request,
            subject: 'Alerta de uso de licencia',
            templateId: templates.applied_license,
            dynamic_template_data: data,
        };

        sgMail
            .send(msg)
            .then(() => {
                print.info('Email sent')
            })
            .catch((error) => {
                print.info(error)
            });
    },

    async SendContactMessageEmail(record) {

        if (!config.email.sendEmails)
            return;

        let nombre = '';

        if (record && record.Contact && record.Contact.includes(' '))
            nombre = record.Contact.split(' ')[ 0 ];
        else
            nombre = record.Contact;

        const title = 'Confirmación de datos recibidos'

        const data = {
            MailTitle: title,
            name: nombre,
            company: record.Company,
            contactName: record.Contact,
            email: record.Email,
            phone: record.Phone,
            message: record.Message,
            code: record.Code,
            header: header_content.replace('{{MailTitle}}', title),
            footer: footer_content
        };

        const msg = {
            to: record.Email,
            from: variables.email_license_request,
            subject: 'Solicitud de Información',
            templateId: templates.contact_information,
            dynamic_template_data: data,
        };

        sgMail
            .send(msg)
            .then(() => {
                print.info('Email sent')
            })
            .catch((error) => {
                print.info(error)
            });
    },

    async SendDBDisconnectedEmail() {

        if (!config.email.sendEmails)
            return;

        const title = 'Alerta de base de datos desconectada';

        const data = {
            MailTitle: title,
            header: header_content.replace('{{MailTitle}}', title),
            footer: footer_content
        };

        const msg = {
            to: variables.email_license_request_cc,
            from: variables.email_license_request,
            subject: title,
            templateId: templates.db_disconnected,
            dynamic_template_data: data,
        };

        sgMail
            .send(msg)
            .then(() => {
                print.info('db-disconnected-email sent')
            })
            .catch((error) => {
                print.info(error)
            });
    },

    async sendDbReconnectedEmail() {

        if (!config.email.sendEmails)
            return;

        const title = 'Conexión Restablecida';

        const data = {
            MailTitle: title,
            header: header_content.replace('{{MailTitle}}', title),
            footer: footer_content
        };

        const msg = {
            to: variables.email_license_request_cc,
            from: variables.email_license_request,
            subject: title,
            templateId: templates.db_reconnected,
            dynamic_template_data: data,
        };

        sgMail
            .send(msg)
            .then(() => {
                print.info('db-reconnected-email sent')
            })
            .catch((error) => {
                print.info(error)
            });
    }
}