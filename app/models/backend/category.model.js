const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({
    name: String, 
    slug: String,
    status: String,
    ordering: Number,
    productList: [ 
        { type: Schema.Types.ObjectId, ref: 'product' }
    ],
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_category, schema );




