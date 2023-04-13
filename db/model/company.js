var mongoose = require('mongoose');

var modelSchema = mongoose.model('company', 
{
    ClientId: { type: String },
    Company: { type: String }, 
    RTN: { type: String }, 
    Address: { type: String }, 
    Contact: { type: String }, 
    Email: { type: String },   
    Password: { type: String },   
    Phones: { type: String }, 
    Active: { type: Boolean, default: true },
    DisabledDate: { type: Date }, 
    Activate: { type: Boolean, default: false },
    ActivateDate: { type: Date }, 
    UpdateDate: { type: Date }, 
    DateOP: { type: Date,default: Date.now },   
    UserAgent: { type: Object }        
});
 
 module.exports = modelSchema;