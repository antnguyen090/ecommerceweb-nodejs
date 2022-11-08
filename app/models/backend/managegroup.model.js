const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    status: String,
    ordering: Number,
    content: String,
    group_acp: String,
    usersList: [ 
        { type: Schema.Types.ObjectId, ref: 'manageuser' }
    ] ,
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_managegroup, schema );