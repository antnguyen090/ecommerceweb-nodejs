const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    slug: String,
    status: String,
    ordering: Number,
    thumb: String,
    description: String,
    editordata: String,
    category: { type: Schema.Types.ObjectId, ref: 'blogcategory' },
},
{ timestamps: true }
);


module.exports = mongoose.model(databaseConfig.col_blogarticle, schema );





