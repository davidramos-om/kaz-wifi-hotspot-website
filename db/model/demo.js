var mongoose = require('mongoose');

var schemaModel = new mongoose.Schema(
    {
        License: { type: String },
        ClientId: { type: String },
        Token: { type: String },
        RTN: { type: String },
        Address: { type: String },
        Contact: { type: String },

        Name: { type: String },
        LastName: { type: String },
        Company: { type: String },
        Email: { type: String },
        CompanyEmail: { type: String },
        HotSpot_Users: { type: Number, default: 10 },
        HotSpot_Profiles: { type: Number, default: 1 },
        HotSpot_Devices: { type: Number, default: 1 },
        App_Users: { type: Number, default: 1 },
        App_Profiles: { type: Number, default: 1 },
        DemoHours: { type: Number, default: 1440 },
        DemoMonth: { type: String, default: '2 meses' },
        AllowDeleteUser: { type: Boolean, default: false },
        AllowDisableUser: { type: Boolean, default: false },
        AllowRePrintCred: { type: Boolean, default: false },
        ShowWaterMark: { type: Boolean, default: true },
        IsDemo: { type: Boolean, default: true },
        MaxDemos: { type: Number, default: 3 },
        Disabled: { type: Boolean, default: false },
        DateOP: { type: Date, default: Date.now },
        active: { type: Boolean, default: true },
        UserAgent: { type: Object },
        Applied: { type: Boolean, default: false },
        Applied_date: { type: Date, default: null },
        Applied_hwid: { type: String, default: '' },
        Applied_pc_name: { type: String, default: '' },
        Applied_system_os: { type: String, default: '' },
        Applied_app_version: { type: String, default: '' },
        Applied_app_lang: { type: String, default: '' },
        Applied_start_date: { type: Date },
        Applied_end_date: { type: Date },
    });


var model = mongoose.model('Demo', schemaModel, 'Demo');

module.exports = model;