var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoInc   = require('mongoose-sequence')(mongoose);

var Tree = new Schema({
  _id: Number,
  _user: { 
    type: Number, 
    ref: '../user.js' 
  }, 
  _request: String,
  _type: { 
    type: Number,
    ref: '../tree_type.js'
  },
  name: String,
  location_lat: String, 
  location_lng: String,
  planting_date: Date
});

Tree.plugin(autoInc, {id: "tree_id"});
module.exports = mongoose.model('tree', Tree);