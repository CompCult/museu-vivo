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

//Find by params
router.get('/query/fields', function(req, res) {
  Tree.find(req.query, function(err, tree) {
    if (err) {
      res.status(400).send(err);
    } else if (!tree){
      res.status(404).send("árvore não encontrada");
    } else {
      res.status(200).json(tree);
    }
  });
});

//Create
router.post('/', function(req, res) {
  var tree              = new Tree();
  tree._user            = req.body._user;
  tree._type            = req.body._type;
  tree._request_id      = req.body._request_id;
  tree.name             = req.body.name;
  tree.location_lat     = req.body.location_lat;
  tree.location_lng     = req.body.location_lng;
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
  	if (req.body.location_lat) tree.location_lat  = req.body.location_lat;
    if (req.body.location_lng) tree.location_lng  = req.body.location_lng;
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