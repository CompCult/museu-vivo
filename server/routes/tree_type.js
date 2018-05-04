var express = require('express');
var router = express.Router();

var TreeType = require('../models/mytree_exclusives/tree_type.js');
var Uploads = require('../upload.js');

//Index
router.get('/', function(req, res) {
  TreeType.find({}, function(err, trees) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(trees);
    }
  });
});

// Trees from user or type
router.get('/fields', function(req, res) {
  if (req.query.user) {
    TreeType.find({ _user: req.query.user}, function(err, trees) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json(trees);
      }
    });
  } else if (req.query.type) {
    TreeType.find({ _type: req.query.type}, function(err, trees) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json(trees);
      }
    });
  }
});

//Create
router.post('/', function(req, res) {
  var type                = new TreeType();
  type.name               = req.body.name;
  type.description        = req.body.description;
  type.ammount_available  = req.body.ammount_available;
  if (req.body.photo) {
    var date = new Date();
    var timeStamp = date.toLocaleString(); 
    Uploads.uploadFile(req.body.photo, req.body._user.toString(), timeStamp);

    var filename = req.body._user.toString() + timeStamp + '.jpg'; 
    post.photo = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
  }

  type.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(type);
    }
  });
});

// Update
router.put('/:tree_id', function(req, res) {
  TreeType.findById(req.params.tree_id, function(err, type) {
	  if (req.body.name) type.name             			         = req.body.name;
	  if (req.body.description) type.description             = req.body.description;
    if (req.body.ammount_available) type.ammount_available = req.body.ammount_available;
    if (req.body.photo) {
      var date = new Date();
      var timeStamp = date.toLocaleString(); 
      Uploads.uploadFile(req.body.photo, req.body._user.toString(), timeStamp);

      var filename = req.body._user.toString() + timeStamp + '.jpg'; 
      post.photo = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
    }
    
    console.log(err);

    type.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(type);
      }
    });
  });
});

// Delete
router.delete('/:tree_id', function(req, res) {
  TreeType.remove({ _id: req.params.tree_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Árvore removida.");
    }
  });
});

module.exports = router;