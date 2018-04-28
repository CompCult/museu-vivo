var express = require('express');
var router = express.Router();
var bcrypt  = require('bcryptjs');


var User = require('../models/user.js');

//Index
router.get('/', function(req, res) {
  User.find({}, function(err, usuarios) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(usuarios);
    }
  });
});

//Show
router.get('/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, usuario) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(usuario);
    }
  });
});

//Create
router.post('/register', function(req, res) {
  var user      = new User();
  user.name       = req.body.name;
  user.email      = req.body.email;

  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {
      res.status(400).send(err);
    } else {
      user.password = hash;
      user.save(function(err) {
        if (err) {
          if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate username
                console.log(err);
                return res.status(400).send('Usuário já existente.');
              }
              // Some other error
              return res.status(400).send(err);
        } else {
          res.status(200).send(user);
        }
      });
    }
  });
});

// Update
router.post('/update/:user_id', function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.type) user.type = req.body.type;
    if (req.body.institution) user.institution = req.body.institution;
    if (req.body.birth) user.birth = new Date(req.body.birth);
    if (req.body.sex) user.sex = req.body.sex;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.street) user.street = req.body.street;
    if (req.body.complement) user.complement = req.body.complement;
    if (req.body.number) user.number = req.body.number;
    if (req.body.neighborhood) user.neighborhood = req.body.neighborhood;
    if (req.body.city) user.city = req.body.city;
    if (req.body.state) user.state = req.body.state;
    if (req.body.zipcode) user.zipcode = req.body.zipcode;
    if (req.body.points) user.points = req.body.points;
    if (req.body.sec_points) user.sec_points = req.body.sec_points;
    if (req.body.request_limit) user.request_limit = req.body.request_limit;
    if (req.body.banned_until) user.banned_until = new Date(req.body.banned_until);


    if (req.body.password) {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        user.password = hash;
        user.save(function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.status(200).send("Usuário atualizado.");
          }
        });
      });
    } else {
      user.save(function(err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send("Usuário atualizado.");
        }
      });
    }
  });
});

//Auth
router.post('/auth', function(req, res) {
  User.findOne({'email': req.body.email}, function(error, user) {
    if (!user) {
      res.status(400).send('Usuário não encontrado.');
    } else if (userIsBanned(user.banned_until)) {
        res.status(400).send('Usuário banido até ' + user.banned_until.toLocaleString())
    } else {
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (err) {
          res.status(400).send(err);
        } else {
          if (result) {
            res.status(200).json(user);
          } else {
            res.status(400).json('Senha incorreta.');
          }
        }
      });
    }
    
  });
});

// Delete
router.delete('/:user_id', function(req, res) {
  User.remove({ _id: req.params.user_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Usuário removido.");
    }
  });
});

//Methods
userIsBanned = function(date) {
  if (date) {
    now = new Date();
    if (date.getTime() > now.getTime()) {
      return true;
    }
  }

  return false;  
} 

module.exports = router;
