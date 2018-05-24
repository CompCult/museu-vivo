var express = require('express');
var router = express.Router();

var Group = require('../models/group.js');
var GroupMember = require('../models/group_member.js');

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

//Find by params
router.get('/query/fields', function(req, res) {
  Group.find(req.query, function(err, Group) {
    if (err) {
      res.status(400).send(err);
    } else if (!Group){
      res.status(404).send("Grupo não encontrado");
    } else {
      res.status(200).json(Group);
    }
  });
});

//Send mail to group
router.post('/email', function(req, res) {
  let group = req.query._group;
  let message = req.query.message;



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

// Update with post
router.post('/update/:group_id', function(req, res) {
  Group.findById(req.params.group_id, function(err, group) {
    if (req.body.name) group.name                       = req.body.name;
    if (req.body.description) group.description         = req.body.description;
    
    group.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(group);
      }
    });
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
        res.status(200).send(group);
      }
    });
  });
});

// Delete with post
router.post('/remove/:group_id', function(req, res) {
  Group.remove({ _id: req.params.group_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      removeGroupMembers(req.params.group_id);

      res.status(200).send("Grupo removido.");
    }
  });
});

// Delete
router.delete('/:group_id', function(req, res) {
  Group.remove({ _id: req.params.group_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      removeGroupMembers(req.params.group_id);

      res.status(200).send("Grupo removido.");
    }
  });
});

var removeGroupMembers = function(group_id) {
  GroupMember.remove({ _group: group_id }).exec();
}

module.exports = router;