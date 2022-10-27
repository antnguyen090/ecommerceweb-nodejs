const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    email: String,
    ordering: Number,
    status: String,
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_newsletter, schema );