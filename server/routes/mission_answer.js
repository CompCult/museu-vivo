var express = require('express');
var router = express.Router();
var bcrypt  = require('bcryptjs');
var AWS = require('aws-sdk');
var fs = require('fs');

var MissionAnswer = require('../models/mission_answer.js');

// AWS config
//  https://769157382962.signin.aws.amazon.com/console  'josejose/'
var s3 =  new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION
});

var params = {Bucket: 'compcult'};
// End AWS

uploadFile = function(file, type, _user){
  var binaryFile = new Buffer(file, 'binary');
  console.log("uploadFile");

  var timeStamp = Math.floor(Date.now());
  var filename = 'josejose/' + _user + type + timeStamp;

  var params = {
      Bucket: 'compcult',
      Key: filename,
      ContentType: type,
      Body: binaryFile,
      ACL: 'public-read'
  };        

  s3.putObject(params, function (resp) {
    console.log(arguments);
    console.log('Successfully uploaded package.');
  });

  //return 'https://s3.amazonaws.com/compcult/josejose/' + filename;
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
  missionAnswer.status      = "pendente";
  if (req.body._group) missionAnswer._group      = req.body._group;
  if (req.body.image) {
    missionAnswer.image     = req.body.image;
    console.log(req.body.image);
    uploadFile(req.body.image, '.jpg', req.body._user);
  }
  if (req.body.audio) missionAnswer.audio     = uploadFile(req.body.audio, '.mp3', req.body._user);
  if (req.body.video) missionAnswer.video     = uploadFile(req.body.video, '.mp4', req.body._user);
  if (req.body.text) missionAnswer.text               = req.body.text;
  if (req.body.geolocation) missionAnswer.geolocation = req.body.geolocation;

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
    if (req.body.image) missionAnswer.image             = req.body.image;
    if (req.body.audio) missionAnswer.audio             = req.body.audio;
    if (req.body.video) missionAnswer.video             = req.body.video;
    if (req.body.text) missionAnswer.text               = req.body.text;
    if (req.body.geolocation) missionAnswer.geolocation = req.body.geolocation;
    
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