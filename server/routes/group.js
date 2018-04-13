var express = require('express');
var router = express.Router();


var Group = require('../models/group.js');

//Index
router.get('/', function(req, res) {
  Group.find({}, function(err, groups) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(groups);
    }
  });
});

//Create
router.post('/', function(req, res) {
  var group              = new Group();
  group.name             = req.body.name;
  group.description      = req.body.description;

  group.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(group);
    }
  });
});

// Update
router.put('/:group_id', function(req, res) {
  Group.findById(req.params.group_id, function(err, group) {
    if (req.body.name) group.name                       = req.body.name;
    if (req.body.description) group.description         = req.body.description;
    
    group.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(group._id);
      }
    });
  });
});

// Delete
router.delete('/:group_id', function(req, res) {
  Group.remove({ _id: req.params.group_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Grupo removido.");
    }
  });
});

module.exports = router;