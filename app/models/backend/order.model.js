const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String,
    trackingCode: String,
    userId: { type: Schema.Types.ObjectId, ref: 'manageuser' },
    address: {
        info: String,
        province:{type: Schema.Types.ObjectId, ref: 'delivery'} 
    },
    phoneNumber: String,
    couponCode: String,
    status: {
        type: String,
        default: 'Pending'
    },
    productList: String,
    costShip: String,
    priceProduct: Number,
    totalMoney: Number,
    notes: String,
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_order, schema );