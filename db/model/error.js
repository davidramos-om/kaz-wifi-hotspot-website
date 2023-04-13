var mongoose = require('mongoose');

 
var ErrorSchema = mongoose.model('Error', 
{
		Function	: 	{ type: String },
		Error		: 	{ type: String }, 
		DateOP	    : 	{ type: Date }, 
});
 
 module.exports = ErrorSchema;