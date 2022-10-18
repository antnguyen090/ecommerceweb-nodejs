const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    link: String,
    status: String,
    ordering: Number,
    thumb: String,
    headertitle: String,
    title: String,
    textbutton: String,
    description: String,
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_slider, schema );





