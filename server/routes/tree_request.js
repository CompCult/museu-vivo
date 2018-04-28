var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var fs = require('fs');


var TreeRequest = require('../models/mytree_exclusives/tree_request.js');
var Tree = require('../models/mytree_exclusives/tree.js');
var User = require('../models/user.js');

// AWS config
// https://769157382962.signin.aws.amazon.com/console  'josejose/'
var s3 =  new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION
});

var params = {Bucket: 'compcult'};
// End AWS

uploadFile = function(file, _user, stamp){
  console.log(file);
  var buffer = new Buffer(file, 'base64');
  var filename = 'minhaarvore/' + _user + stamp + '.jpg';

  var params = {
      Bucket: 'compcult',
      Key: filename,
      Body: buffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
  };        

  s3.putObject(params, function (resp) {
    console.log('Successfully uploaded package.');
  });
}


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
  var request             = new TreeRequest();

  request._user           = req.body._user;
  request._type           = req.body._type;
  request.tree_name       = req.body.tree_name;
  if(req.body.location_lat) request.location_lat    = req.body.location_lat;
  if(req.body.location_lng) request.location_lng    = req.body.location_lng;
  request.quantity        = req.body.quantity;
  request.requester_name  = req.body.requester_name;
  request.place			      = req.body.place;
  request.status          = 'Pendente';
  request.updated_at      = new Date();
  if (req.body.sidewalk_size) request.sidewalk_size   = req.body.sidewalk_size;
  if (req.body.street) request.street = req.body.street;
  if (req.body.complement) request.complement = req.body.complement;
  if (req.body.number) request.number = req.body.number;
  if (req.body.neighborhood) request.neighborhood = req.body.neighborhood;
  if (req.body.city) request.city = req.body.city;
  if (req.body.state) request.state = req.body.state;
  if (req.body.zipcode) request.zipcode = req.body.zipcode;
  if (req.body.photo) {
    var date = new Date();
    var timeStamp = date.toLocaleString();
    var filename = req.body._user.toString() + timeStamp + '.jpg';  
    uploadFile(req.body.photo, req.body._user.toString(), timeStamp);
    request.photo = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
  }
  if(req.body.sidewalk_size) request.sidewalk_size    = req.body.sidewalk_size;
  if(req.body.answer_date) request.answer_date = new Date(req.body.answer_date);

  User.findById(req.body._user, function(err, user) {
    if (user && (user.request_limit < req.body.quantity)) {
      res.status(400).send('A quantidade pedida ultrapassa o limite do usuário.');
    } else {
      request.save(function(err) {
        if (err) {
          res.status(400).send(err);
        } else {
          createTrees(request);
          res.status(200).send(request);
        }
      });
    }
  });
});

// Update
router.put('/:tree_id', function(req, res) {
  TreeRequest.findById(req.params.tree_id, function(err, request) {
    if (req.body._user) request._user                   = req.body._user;
	  if (req.body._type) request._type             		  = req.body._type;
    if (req.body.tree_name) request.tree_name           = req.body.tree_name;
    if (req.body.location_lat) request.location_lat     = req.body.location_lat;
    if (req.body.location_lng) request.location_lng     = req.body.location_lng;
    if (req.body.quantity) request.quantity             = req.body.quantity;
	  if (req.body.requester_name) request.requester_name = req.body.requester_name;
    if (req.body.place) request.place                   = req.body.place;
    if (req.body.status) {
      request.status      = req.body.status;
      request.updated_at  = new Date();
    }
    if (req.body.photo) {
      console.log('has a photo');
      var date = new Date();
      var timeStamp = date.toLocaleString();
      var filename = req.body._user.toString() + timeStamp + '.jpg';    
      uploadFile(req.body.photo, req.body._user.toString(), timeStamp);

      request.photo = 'https://s3.amazonaws.com/compcult/minhaarvore/' + filename;
    }
    if (req.body.sidewalk_size) request.sidewalk_size   = req.body.sidewalk_size;
    if (req.body.street) request.street = req.body.street;
    if (req.body.complement) request.complement = req.body.complement;
    if (req.body.number) request.number = req.body.number;
    if (req.body.neighborhood) request.neighborhood = req.body.neighborhood;
    if (req.body.city) request.city = req.body.city;
    if (req.body.state) request.state = req.body.state;
    if (req.body.zipcode) request.zipcode = req.body.zipcode;
    
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
createTrees = function(request) {
  for (i = 0; i < request.quantity; i++) {
    var tree              = new Tree();
    tree._user            = request._user;
    tree._type            = request._type;
    tree._request_id      = request._id;
    tree.name             = request.tree_name;
    tree.location_lat     = request.location_lat;
    tree.location_lng     = request.location_lng;

    tree.save(function(err) {
      if (err) {
        console.log('algo deu ruim');
      } else {
        console.log('Arvores criadas!');
      }
    });
  }
} 

module.exports = router;
