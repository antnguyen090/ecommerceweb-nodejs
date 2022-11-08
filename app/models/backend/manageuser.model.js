const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var schema = new mongoose.Schema({
    name: String, 
    status: {
        type: String,
        default: 'inactive'
    },
    content: String,
    avatar: String,
    password: String,
    email: String,
    thumb: String,
    address: {
      info: String,
      province:{type: Schema.Types.ObjectId, ref: 'delivery'} 
    },
    otp: {
      code: {
          type: String,
          default: null},
      time_get: { 
          type: Date,
          default: null},
    },
    group: { type: Schema.Types.ObjectId, ref: 'managegroup' },
},
{ timestamps: true }
);

schema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
});


module.exports = mongoose.model(databaseConfig.col_manageuser, schema );





