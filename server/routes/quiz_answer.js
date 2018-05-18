var express = require('express');
var router = express.Router();

var QuizAnswer = require('../models/quiz_answer.js');

//Index
router.get('/', function(req, res) {
  QuizAnswer.find({}, function(err, answers) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(answers);
    }
  });
});

//Find by params
router.get('/query/fields', function(req, res) {
  QuizAnswer.find(req.query, function(err, answer) {
    if (err) {
      res.status(400).send(err);
    } else if (!answer){
      res.status(404).send("Resposta do quiz não encontrada");
    } else {
      res.status(200).json(answer);
    }
  });
});

//Create
router.post('/', function(req, res) {
  var quiz_answer         = new QuizAnswer();
  quiz_answer._user       = req.body._user;
  quiz_answer._quiz       = req.body._quiz;
  quiz_answer.answer      = req.body.answer;

  quiz_answer.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(quiz_answer);
    }
  });
});

// Update
router.put('/:answer_id', function(req, res) {
  QuizAnswer.findById(req.params.answer_id, function(err, quiz_answer) {
    if (req.body._user) quiz_answer._user   = req.body._user;
    if (req.body._quiz) quiz_answer._quiz   = req.body._quiz;
    if (req.body.answer) quiz_answer.answer = req.body.answer;

    quiz_answer.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(quiz_answer._id);
      }
    });
  });
});

// Delete
router.delete('/:quiz_answer_id', function(req, res) {
  QuizAnswer.remove({ _id: req.params.quiz_answer_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Resposta removida.");
    }
  });
});

module.exports = router;