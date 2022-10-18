const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String,
    price: Number,
    discountProduct: [
        { type: Schema.Types.ObjectId, ref: 'discount' }
    ],
    description: String,
    quantity: Number,
    slug: String,
    status: String,
    ordering: Number,
    thumb: Array,
    dailydeals: {
        type: Boolean,
        default: false
    },
    fearturedproduct: {
        type: Boolean,
        default: false
    },
    content: String,
    category: { type: Schema.Types.ObjectId, ref: 'category' },
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_product, schema );






