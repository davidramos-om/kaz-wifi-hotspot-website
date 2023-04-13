var mongoose = require('mongoose');
 
var schemaModel = new mongoose.Schema(
    {
        Licencia: { type: String },    
        HardwareId: { type: String }, 
        Maquina: { type: String }, 
        Valida: { type: Boolean },
        Activada: { type: Boolean },        
        LicFechaInicio: { type: Date }, 
        LicHoras: { type: Number },         
        LicFechaFin: { type: Date }, 
        Empresa: { type: String }, 
        RTN: { type: String }, 
        Direccion: { type: String }, 
        Contacto: { type: String }, 
        Correo: { type: String },     
        FechaPc: { type: Date },      
        // HoraPc: { type: Date },     
        AppVersion: { type: String }, 
        SO: { type: String }, 
        TotalBody: { type: Object },        
        DateOP: { type: Date },         
        UserAgent: { type: Object }                
    });
    
var model = mongoose.model('Trace', schemaModel, 'Trace');
    
module.exports = model;