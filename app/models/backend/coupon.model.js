const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String,
    couponcode: String,
    description: String,
    couponValue: {
        unit: String,
        value: Number,
        minTotal: Number,
        maxDown: Number
    },
    ordering: Number,
    status: String,
    turnused: {
        type: Number,
        default: 0,
    },
    time: String,
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_coupon, schema );