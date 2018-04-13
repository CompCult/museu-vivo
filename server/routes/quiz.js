var express = require('express');
var router = express.Router();


var Quiz = require('../models/quiz.js');

//Index
router.get('/', function(req, res) {
  Quiz.find({}, function(err, quizzes) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(quizzes);
    }
  });
});

//Create
router.post('/', function(req, res) {
  var quiz             = new Quiz();
  quiz.title           = req.body.title;
  quiz.description     = req.body.description;
  quiz.points          = req.body.points;
  quiz.secret_code     = generateSecretCode();
  quiz.is_public       = req.body.is_public;
  quiz.single_answer   = req.body.single_answer;
  quiz.alternative_a   = req.body.alternative_a;
  quiz.alternative_b   = req.body.alternative_b;
  quiz.correct_answer  = req.body.correct_answer;
  quiz.start_time      = new Date(req.body.start_time);
  quiz.end_time        = new Date(req.body.end_time);
  if(req.body.alternative_c) quiz.alternative_c   = req.body.alternative_c;
  if(req.body.alternative_d) quiz.alternative_d   = req.body.alternative_d;
  if(req.body.alternative_e) quiz.alternative_e   = req.body.alternative_e;

  quiz.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(quiz.secret_code);
    }
  });
});

// Update
router.put('/:quiz_id', function(req, res) {
  Quiz.findById(req.params.quiz_id, function(err, quiz) {
    if(req.body.title) quiz.title                   = req.body.title;
    if(req.body.description) quiz.description       = req.body.description;
    if(req.body.points) quiz.points                 = req.body.points;
    if(req.body.is_public) quiz.is_public           = req.body.is_public;
    if(req.body.single_answer) quiz.single_answer   = req.body.single_answer;
    if(req.body.alternative_a) quiz.alternative_a   = req.body.alternative_a;
    if(req.body.alternative_b) quiz.alternative_b   = req.body.alternative_b;
    if(req.body.correct_answer) quiz.correct_answer = req.body.correct_answer;
    if(req.body.start_time) quiz.start_time         = new Date(req.body.start_time);
    if(req.body.end_time) quiz.end_time             = new Date(req.body.end_time);
    if(req.body.alternative_c) quiz.alternative_c   = req.body.alternative_c;
    if(req.body.alternative_d) quiz.alternative_d   = req.body.alternative_d;
    if(req.body.alternative_e) quiz.alternative_e   = req.body.alternative_e;
    
    quiz.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(quiz);
      }
    });
  });
});

// Delete
router.delete('/:quiz_id', function(req, res) {
  Quiz.remove({ _id: req.params.quiz_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Quiz removido.");
    }
  });
});

//Show
router.get('/:quiz_id', function(req, res) {
  Quiz.find({ _id: req.params.quiz_id }, function(err, quiz) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(quiz);
    }
  });
});

generateSecretCode = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = router;