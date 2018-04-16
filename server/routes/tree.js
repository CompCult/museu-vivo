var express = require('express');
var router = express.Router();


var Tree = require('../models/mytree_exclusives/tree.js');

//Index
router.get('/', function(req, res) {
  Tree.find({}, function(err, trees) {
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
    Tree.find({ _user: req.query.user}, function(err, trees) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json(trees);
      }
    });
  } else if (req.query.type) {
    Tree.find({ _type: req.query.type}, function(err, trees) {
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
  var tree              = new Tree();
  tree._user            = req.body._user;
  tree._type            = req.body._type;
  tree._request_id      = req.body._request_id;
  tree.name             = req.body.name;
  tree.geolocation      = req.body.geolocation;
  if(req.body.planting_date) tree.planting_date = new Date(req.body.planting_date);

  tree.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(tree);
    }
  });
});

// Update
router.put('/:tree_id', function(req, res) {
  Tree.findById(req.params.tree_id, function(err, tree) {
    if (req.body._user) tree._user           	    = req.body._user;
  	if (req.body._type) tree._type            		= req.body._type;
    if (req.body._request_id) tree._request_id    = req.body._request_id;
  	if (req.body.name) tree.name             			= req.body.name;
  	if (req.body.geolocation) tree.geolocation    = req.body.geolocation;
  	if(req.body.planting_date) tree.planting_date = new Date(req.body.planting_date);
    
    tree.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(tree._id);
      }
    });
  });
});

// Delete
router.delete('/:tree_id', function(req, res) {
  Tree.remove({ _id: req.params.tree_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Árvore removida.");
    }
  });
});

module.exports = router;