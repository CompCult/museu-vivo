var express = require('express');
var router = express.Router();


var Appointment = require('../models/appointment.js');
var AppointmentRequest = require('../models/appointment_request.js');

//Index
router.get('/', function(req, res) {
  Appointment.find({}, function(err, appointments) {
    if (err) {
      res.status(400).send(err);
    } else {
      let date  = new Date();

      results = appointments.filter(function(appointment) {
        let start = new Date(appointment.start_date);
        let end   = new Date(appointment.end_date);
        
        console.log("end: " + end);
        console.log("date: " + date);
        console.log("end >= date: " + (end >= date));

        return (end >= date);
      }); 

      res.status(200).json(results);
    }
  });
});

//Find by params
router.get('/query/fields', function(req, res) {
  Appointment.find(req.query, function(err, event) {
    if (err) {
      res.status(400).send(err);
    } else if (!event){
      res.status(404).send("Evento não encontrado");
    } else {
      res.status(200).json(event);
    }
  });
});

//Show
router.get('/:appointment_id', function(req, res) {
  Appointment.findById(req.params.appointment_id, function(err, appointment) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(appointment);
    }
  });
});

//Create
router.post('/', function(req, res) {
  var appointment         = new Appointment();
  appointment._user       = req.body._user;
  appointment.name        = req.body.name;
  appointment.description = req.body.description;
  appointment.place       = req.body.place;
  appointment.type        = req.body.type;
  appointment.start_date  = new Date(req.body.start_date);
  appointment.end_date    = new Date(req.body.end_date);

  appointment.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(appointment);
    }
  });
});

// Update
router.put('/:appointment_id', function(req, res) {
  Appointment.findById(req.params.appointment_id, function(err, appointment) {
    if (req.body.name) appointment.name               = req.body.name;
    if (req.body.description) appointment.description = req.body.description;
    if (req.body.place) appointment.place             = req.body.place;
    if (req.body.type) appointment.type               = req.body.type;
    if (req.body.start_date) appointment.start_date   = new Date(req.body.start_date);
    if (req.body.end_date) appointment.end_date       = new Date(req.body.end_date);
    
    appointment.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(appointment);
      }
    });
  });
});

// Delete
router.delete('/:appointment_id', function(req, res) {
  Appointment.remove({ _id: req.params.appointment_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      removeAppointmentRequests(req.params.appointment_id);

      res.status(200).send("Compromisso removido.");
    }
  });
});

var removeAppointmentRequests = function(id) {
  AppointmentRequest.deleteMany({ _appointment: id }).exec();
}

module.exports = router;
