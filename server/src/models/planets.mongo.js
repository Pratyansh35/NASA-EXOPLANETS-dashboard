const { mongoose } = require('mongoose');
const pmongoose = require('mongoose');

const planetschema = new pmongoose.Schema({
    keplerName:{
        type:String,
        required:true
    },
});

module.exports = mongoose.model('Planets', planetschema);