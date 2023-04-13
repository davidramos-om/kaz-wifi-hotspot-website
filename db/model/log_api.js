var mongoose = require('mongoose');
 
var schemaModel = new mongoose.Schema(
    {
        Api: { type: String },
        Function: { type: String },
        Title: { type: String },
        Description: { type: String },
        Obs: { type: String },
        ObjectInfo: { type: Object },
        Active: { type: Boolean, default: false },
        DateOP: { type: Date,default: Date.now },        
        UserAgent: { type: Object },
    });
    
    
var model = mongoose.model('log_api', schemaModel, 'log_api');
    
module.exports = model;