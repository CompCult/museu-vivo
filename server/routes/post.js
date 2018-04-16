var express = require('express');
var router = express.Router();
var bcrypt  = require('bcryptjs');
var AWS = require('aws-sdk');
var fs = require('fs');

var Post = require('../models/post.js');

// AWS config
// https://769157382962.signin.aws.amazon.com/console  'timeline/'
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
  var filename = 'timeline/' + _user + type + timeStamp;

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

  return 'https://s3.amazonaws.com/compcult/timeline/' + filename;
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
  if (req.body.image) post.image             = uploadFile(req.body.image, '.jpg', req.body._user);
  if (req.body.audio) post.audio             = req.body.audio;
  if (req.body.video) post.video             = req.body.video;
  if (req.body.geolocation) post.geolocation = req.body.geolocation;

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
    if (req.body.image) post.image             = uploadFile(req.body.image, '.jpg', req.body._user);
    if (req.body.audio) post.audio             = req.body.audio;
    if (req.body.video) post.video             = req.body.video;
    if (req.body.geolocation) post.geolocation = req.body.geolocation;
    
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
