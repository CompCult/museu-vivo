var express = require('express');
var router = express.Router();
var bcrypt  = require('bcryptjs');


var Mission = require('../models/mission.js');

//Index
router.get('/', function(req, res) {
  Mission.find({}, function(err, missions) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(missions);
    }
  });
});

//Create
router.post('/', function(req, res) {
  var mission              = new Mission();
  mission.name             = req.body.name;
  mission.description      = req.body.description;
  mission.has_image        = req.body.has_image;
  mission.has_audio        = req.body.has_audio;
  mission.has_video        = req.body.has_video;
  mission.has_text         = req.body.has_text;
  mission.has_geolocation = req.body.has_geolocation;

  mission.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(mission);
    }
  });
});

// Update
router.put('/:mission_id', function(req, res) {
  Mission.findById(req.params.mission_id, function(err, mission) {
    if (req.body.name) mission.name                       = req.body.name;
    if (req.body.description) mission.description         = req.body.description;
    if (req.body.has_image) mission.has_image             = req.body.has_image;
    if (req.body.has_audio) mission.has_audio             = req.body.has_audio;
    if (req.body.has_video) mission.has_video             = req.body.has_video;
    if (req.body.has_text) mission.has_text               = req.body.has_text;
    if (req.body.has_geolocation) mission.has_geolocation = req.body.has_geolocation;
    
    mission.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(mission._id);
      }
    });
  });
});

// Delete
router.delete('/:mission_id', function(req, res) {
  Mission.remove({ _id: req.params.mission_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Missão removida.");
    }
  });
});

router.get('/missions', function(req, res) {
  var mission_name = req.query.missionname;
  Mission.find({mail: mission_name}, function (err, mission) {
        if (err != null){
            console.log(err);
        }
        res.json(mission);
  });
});

module.exports = router;