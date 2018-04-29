var express = require('express');
var router = express.Router();
var bcrypt  = require('bcryptjs');
var AWS = require('aws-sdk');
var fs = require('fs');

var MissionAnswer = require('../models/mission_answer.js');

// AWS config
// https://769157382962.signin.aws.amazon.com/console  'josejose/'
var s3 =  new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION
});

uploadFile = function(file, _user, stamp){
  console.log(file);
  var buffer = new Buffer(file, 'base64');
  var filename = 'minhaarvore/' + _user + stamp + '.jpg';

  var params = {
      Bucket: 'compcult',
      Key: filename,
      Body: buffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
  };        

  s3.putObject(params, function (resp) {
    console.log('Successfully uploaded package.');
  });
}

//Index
router.get('/', function(req, res) {
  MissionAnswer.find({}, function(err, missions) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(missions);
    }
  });
});

//Create
router.post('/', function(req, res) {
  var missionAnswer         = new MissionAnswer();
  missionAnswer._user       = req.body._user;
  missionAnswer._mission    = req.body._mission;
  missionAnswer.status      = "Pendente";
  if (req.body._group) missionAnswer._group      = req.body._group;
  if (req.body.image) {
    var date = new Date();
    var timeStamp = date.toLocaleString(); 
    uploadFile('image', req.body.image, req.body._user.toString(), timeStamp);

    var filename = req.body._user.toString() + timeStamp + '.jpg'; 
    request.image = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
  };
  if (req.body.audio) {
    var date = new Date();
    var timeStamp = date.toLocaleString(); 
    uploadFile('audio', req.body.audio, req.body._user.toString(), timeStamp);

    var filename = req.body._user.toString() + timeStamp + '.wav'; 
    request.audio = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
  };
  if (req.body.video) missionAnswer.video     = req.body.video;
  if (req.body.text) missionAnswer.text               = req.body.text;
  if (req.body.location_lat) missionAnswer.location_lat = req.body.location_lat;
  if (req.body.location_lng) missionAnswer.location_lng = req.body.location_lng;

  missionAnswer.save(function(err) {
    if (err) {
      res.sendStatus(400).send(err);
    } else {
      res.sendStatus(200).send(missionAnswer._id);
    }
  });
});

// Update
router.put('/:mission_id', function(req, res) {
  MissionAnswer.findById(req.params.mission_id, function(err, mission) {
    if (req.body._user) missionAnswer._user             = req.body._user;
    if (req.body._mission) missionAnswer._mission       = req.body._mission;
    if (req.body._group) missionAnswer._group           = req.body._group;
    if (req.body.image) {
      var date = new Date();
      var timeStamp = date.toLocaleString(); 
      uploadFile('image', req.body.image, req.body._user.toString(), timeStamp);

      var filename = req.body._user.toString() + timeStamp + '.jpg'; 
      request.image = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
    };
    if (req.body.audio) {
      var date = new Date();
      var timeStamp = date.toLocaleString(); 
      uploadFile('audio', req.body.audio, req.body._user.toString(), timeStamp);

      var filename = req.body._user.toString() + timeStamp + '.wav'; 
      request.audio = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
    };
    if (req.body.video) missionAnswer.video             = req.body.video;
    if (req.body.text) missionAnswer.text               = req.body.text;
    if (req.body.location_lat) missionAnswer.location_lat = req.body.location_lat;
    if (req.body.location_lng) missionAnswer.location_lng = req.body.location_lng;
    
    missionAnswer.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(missionAnswer._id);
      }
    });
  });
});

// Delete
router.delete('/:mission_id', function(req, res) {
  MissionAnswer.remove({ _id: req.params.mission_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Missão removida.");
    }
  });
});

router.get('/missions', function(req, res) {
  var mission_name = req.query.missionname;
  MissionAnswer.find({mail: mission_name}, function (err, mission) {
        if (err != null){
            console.log(err); 
        }
        res.json(mission);
  });
});

module.exports = router;