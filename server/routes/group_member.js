var express = require('express');
var router = express.Router();
var bcrypt  = require('bcryptjs');


var GroupMember = require('../models/group_member.js');

//Index
router.get('/', function(req, res) {
  GroupMember.find({}, function(err, members) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(members);
    }
  });
});

//Find by params
router.get('/query/fields', function(req, res) {
  GroupMember.find(req.query, function(err, member) {
    if (err) {
      res.status(400).send(err);
    } else if (!member){
      res.status(404).send("Membro não encontrado");
    } else {
      res.status(200).json(member);
    }
  });
});

//Create
router.post('/', function(req, res) {
  var member       = new GroupMember();
  member._user     = req.body._user;
  member._group    = req.body._group;
  member.is_admin  = req.body.is_admin;

  member.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(member);
    }
  });
});

// Update
router.put('/:member_id', function(req, res) {
  GroupMember.findById(req.params.member_id, function(err, member) {
    if (req.body.is_admin) member.is_admin  = req.body.is_admin;
    
    member.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(member._id);
      }
    });
  });
});

// Delete
router.delete('/:member_id', function(req, res) {
  GroupMember.remove({ _id: req.params.member_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Membro deletado!");
    }
  });
});

module.exports = router;