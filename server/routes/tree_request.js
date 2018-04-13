var express = require('express');
var router = express.Router();


var TreeRequest = require('../models/mytree_exclusives/tree_request.js');

//Index
router.get('/', function(req, res) {
  TreeRequest.find({}, function(err, trees) {
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
    TreeRequest.find({ _user: req.query.user}, function(err, trees) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json(trees);
      }
    });
  } else if (req.query.type) {
    TreeRequest.find({ _type: req.query.type}, function(err, trees) {
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
  var request              = new TreeRequest();
  request._user            = req.body._user;
  request._type            = req.body._type;
  request.requester_name   = req.body.requester_name;
  request.place			   = req.body.place;
  if(req.body.answer_date) request.answer_date = new Date(req.body.answer_date);

  request.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(request);
    }
  });
});

// Update
router.put('/:tree_id', function(req, res) {
  TreeRequest.findById(req.params.tree_id, function(err, request) {
    if (req.body._user) request._user                   = req.body._user;
	if (req.body._type) request._type            		= req.body._type;
	if (req.body.requester_name) request.requester_name = req.body.requester_name;
  	if (req.body.place) request.place			        = req.body.place;
  	if (req.body.answer_date) request.answer_date       = new Date(req.body.answer_date);
    
    request.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(request._id);
      }
    });
  });
});

// Delete
router.delete('/:tree_id', function(req, res) {
  TreeRequest.remove({ _id: req.params.tree_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Árvore removida.");
    }
  });
});

module.exports = router;