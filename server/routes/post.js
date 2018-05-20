var express = require('express');
var router = express.Router();

var Post = require('../models/post.js');
var User = require('../models/user.js');
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

//Find by params
router.get('/query/fields', function(req, res) {
  Post.find(req.query, function(err, post) {
    if (err) {
      res.status(400).send(err);
    } else if (!post){
      res.status(404).send("Post não encontrado");
    } else {
      res.status(200).json(post);
    }
  });
});

//Create
router.post('/', function(req, res) {
  var post     = new Post();
  post._user   = req.body._user;
  if (req.body.text_msg) post.text_msg = req.body.text_msg;
  if (req.body.location_lat) post.location_lat = req.body.location_lat;
  if (req.body.location_lng) post.location_lng = req.body.location_lng;
  if (req.body.picture) {
    var date = new Date();
    var timeStamp = date.toLocaleString(); 
    Uploads.uploadFile(req.body.picture, req.body._user.toString(), timeStamp);

    var filename = req.body._user.toString() + timeStamp + '.jpg'; 
    post.picture = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
  }
  if (req.body.audio) {
    var date = new Date();
    var timeStamp = date.toLocaleString(); 
    Uploads.uploadAudio(req.body.audio, req.body._user.toString(), timeStamp);

    var filename = req.body._user.toString() + 'audio' + timeStamp + '.wav'; 
    post.audio = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
  };
  //if (req.body.video) post.video             = req.body.video;

  User.findById(req.body._user, function(err, user) {
    if (!user || err) {
      res.status(400).send("Usuário incorreto!");
    } else {
      post.author_name  = user.name; 
      post.author_photo = user.picture;

      post.save(function(err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(post);
        }
      });
    }
  });
});

// Update
router.post('/update/:post_id', function(req, res) {
  Post.findById(req.params.post_id, function(err, post) {
    if (!post || err) {
      res.status(400).send('Post não encontrado!');
    } else {
        if (req.body.text_msg) post.text_msg       = req.body.text_msg;
        if (req.body.picture) {
          var date = new Date();
          var timeStamp = date.toLocaleString(); 
          Uploads.uploadFile(req.body.picture, req.body._user.toString(), timeStamp);

          var filename = req.body._user.toString() + timeStamp + '.jpg'; 
          post.picture = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
        }
        if (req.body.audio) {
          var date = new Date();
          var timeStamp = date.toLocaleString(); 
          Uploads.uploadAudio(req.body.audio, req.body._user.toString(), timeStamp);

          var filename = req.body._user.toString() + 'audio' + timeStamp + '.wav'; 
          post.audio = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
        };
        //if (req.body.video) post.video             = req.body.video;
        if (req.body.location_lat) post.location_lat = req.body.location_lat;
        if (req.body.location_lng) post.location_lng = req.body.location_lng;
        if (req.body.points) post.points = req.body.points;

        post.save(function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.status(200).send(post);
          }
        });
      }
  });
});

// Delete
router.post('/remove/:post_id', function(req, res) {
  Post.remove({ _id: req.params.post_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("POst removido.");
    }
  });
});

module.exports = router;
