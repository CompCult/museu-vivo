var express = require('express');
var router = express.Router();

var Post = require('../models/post.js');
var Uploads = require('../upload.js');

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
  if (req.body.picture) {
    var date = new Date();
    var timeStamp = date.toLocaleString(); 
    Uploads.uploadFile(req.body.picture, req.body._user.toString(), timeStamp);

    var filename = req.body._user.toString() + timeStamp + '.jpg'; 
    post.picture = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
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
    if (req.body.picture) {
      var date = new Date();
      var timeStamp = date.toLocaleString(); 
      Uploads.uploadFile(req.body.picture, req.body._user.toString(), timeStamp);

      var filename = req.body._user.toString() + timeStamp + '.jpg'; 
      post.picture = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
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
