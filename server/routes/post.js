var express = require('express');
var router = express.Router();
var bcrypt  = require('bcryptjs');
var AWS = require('aws-sdk');
var fs = require('fs');

var Post = require('../models/post.js');

// AWS
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
  Post.find({}, function(err, posts) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(posts);
    }
  });
});


//Create
router.post('/', function(req, res) {
  var post     = new Post();
  post._user   = req.body._user;
  if (req.body.text_msg) post.text_msg       = req.body.text_msg;
  if (req.body.image) {
    var date = new Date();
    var timeStamp = date.toLocaleString(); 
    uploadFile(req.body.image, req.body._user.toString(), timeStamp);

    var filename = req.body._user.toString() + timeStamp + '.jpg'; 
    post.image = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
  }
  if (req.body.audio) post.audio             = req.body.audio;
  if (req.body.video) post.video             = req.body.video;
  if (req.body.location_lat) post.location_lat = req.body.location_lat;
  if (req.body.location_lng) post.location_lng = req.body.location_lng;

  post.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(post);
    }
  });
});

// Update
router.put('/:post_id', function(req, res) {
  Post.findById(req.params.post_id, function(err, post) {
    if (req.body.text_msg) post.text_msg       = req.body.text_msg;
    if (req.body.image) {
      var date = new Date();
      var timeStamp = date.toLocaleString(); 
      uploadFile(req.body.image, req.body._user.toString(), timeStamp);

      var filename = req.body._user.toString() + timeStamp + '.jpg'; 
      post.image = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
    }
    if (req.body.audio) post.audio             = req.body.audio;
    if (req.body.video) post.video             = req.body.video;
    if (req.body.location_lat) post.location_lat = req.body.location_lat;
    if (req.body.location_lng) post.location_lng = req.body.location_lng;
    
    post.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(post._id);
      }
    });
  });
});

// Delete
router.delete('/:post_id', function(req, res) {
  Post.remove({ _id: req.params.post_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("POst removido.");
    }
  });
});

module.exports = router;
