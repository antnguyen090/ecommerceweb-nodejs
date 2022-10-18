const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    description: String,
    discountValue: {
        unit: String,
        value: Number,
    },
    ordering: Number,
    status: String,
    time: String,
    expired: Boolean,
    productList: [
        { type: Schema.Types.ObjectId, ref: 'product' }
    ],
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_discount, schema );