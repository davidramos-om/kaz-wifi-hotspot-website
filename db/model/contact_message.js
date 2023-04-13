var mongoose = require('mongoose');

var schemaModel = new mongoose.Schema(
    {
        Code: { type: String },
        Contact: { type: String },
        Email: { type: String },
        Phone: { type: String },
        Company: { type: String },
        Message: { type: String },
        Read: { type: Boolean, default: false },
        ReadBy: { type: String },
        ReadDate: { type: Date },
        Actite: { type: Boolean, default: true },
        Active: { type: Boolean, default: true },
        DateOP: { type: Date, default: Date.now },
        UserAgent: { type: Object },
    });


var model = mongoose.model('contact_message', schemaModel, 'contact_message');

module.exports = model;