var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoInc   = require('mongoose-sequence')(mongoose);

var Appointment = new Schema({
  _id: Number,
  name: String,
  description: String,
  place: String,
  type: String,
  date: Date
});

Appointment.plugin(autoInc, {id: "appointment_id"});
module.exports = mongoose.model('appointment', Appointment);
