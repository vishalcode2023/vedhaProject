const mongoose = require('mongoose');

const detailsdata = mongoose.Schema({
    name:String,
    details:String,
    location:String,
    contact:String,
    problemstatemet:String,
    Strong:String,
})

module.exports = mongoose.model('Detailsdata', detailsdata);