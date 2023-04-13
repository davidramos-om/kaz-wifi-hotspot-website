var mongoose = require('mongoose');

 
var modelSchema = mongoose.model('Usuario', 
{
    Nombre: { type: String }, 
    Apellido: { type: String }, 
    Correo: { type: String },   
    Clave: { type: String },   
    Verificado: { type: Boolean },   
    Anulado: { type: Boolean },   
    DateOP: { type: Date }, 
        
});
 
 module.exports = modelSchema;