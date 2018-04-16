var express = require('express');
var router = express.Router();


var TreeRequest = require('../models/mytree_exclusives/tree_request.js');
var User = require('../models/user.js');


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
  request.tree_name        = req.body.tree_name;
  request.geolocation      = req.body.geolocation;
  request.quantity         = req.body.quantity;
  request.requester_name   = req.body.requester_name;
  request.place			       = req.body.place;
  if(req.body.answer_date) request.answer_date = new Date(req.body.answer_date);

  if (!canUserRequest(req.body._user, req.body.quantity)) {
    res.status(400).send('A quantidade pedida ultrapassa o limite do uruário.');
  } else {
    request.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(request);
      }
    });
  }
});

// Update
router.put('/:tree_id', function(req, res) {
  TreeRequest.findById(req.params.tree_id, function(err, request) {
    if (req.body._user) request._user                   = req.body._user;
	  if (req.body._type) request._type             		  = req.body._type;
    if (req.body.tree_name) request.tree_name           = req.body.tree_name;
    if (req.body.geolocation) request.geolocation       = req.body.geolocation;
    if (req.body.quantity) request.quantity             = req.body.quantity;
	  if (req.body.requester_name) request.requester_name = req.body.requester_name;
  	if (req.body.place) request.place			              = req.body.place;
  	if (req.body.answer_date) request.answer_date       = new Date(req.body.answer_date);
    
    request.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(request);
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

//Methods
canUserRequest = function(id, quantity) {
  User.findById(id, function(err, user) {
    if (user && (user.request_limit < quantity)) {
       return false;
    }
    return true;
  }); 
} 

module.exports = router;