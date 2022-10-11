const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String,
    price: Number,
    discountProduct: Number,
    description: String,
    comments: [{
        userId: String,
        comment_content: String,
        comment_time: String
    }],
    stock: Number,
    views: Number,
    rating: [{
        userId: String,
        rate: Number,
        rate_time: String
    }],
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
    detail: String,
    category: { type: Schema.Types.ObjectId, ref: 'category' },
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_product, schema );






