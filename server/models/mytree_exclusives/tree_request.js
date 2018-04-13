var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoInc   = require('mongoose-sequence')(mongoose);

var TreeRequest = new Schema({
  _id: Number,
  _user: { 
    type: Number, 
    ref: '../user.js' 
  }, _type: { 
    type: Number,
    ref: '../tree_type.js'
  },
  requester_name: String,
  place: String,
  request_date: {
    type: Date,
    default: Date.now
  },
  answer_date: Date
});

TreeRequest.plugin(autoInc, {id: "request_id"});
module.exports = mongoose.model('tree_request', TreeRequest);