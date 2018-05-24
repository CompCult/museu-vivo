var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
var Group = require('../models/group.js');
var Quiz = require('../models/quiz.js');
var QuizAnswer = require('../models/quiz_answer.js');

//Index
router.get('/', function(req, res) {
  QuizAnswer.find({}, function(err, answers) {
    if (err) {
      res.status(400).send(err);
    } else {
      let promises;

      try {
        promises = answers.map(inject_data);
      } catch (err) {
        res.status(400).send(err); 
      }

      Promise.all(promises).then(function(results) {
          res.status(200).json(results);
      });
    }
  });
});

var inject_data = async function(answer) {
  let user_id = answer._user;
  let quiz_id = answer._quiz;
  let group_id = answer._group;
  let answer_complete = answer;

  let user_obj = await User.findById(user_id).exec();
  let quiz_obj = await Quiz.findById(quiz_id).exec();
  let group_id = await Group.findById(group_id).exec();
}

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
      verifyAnswer(quiz_answer);

      res.status(200).send(quiz_answer);
    }
  });
});

var verifyAnswer = function(answer) {
  Quiz.findById(answer._quiz, function(err, quiz) {
    if (quiz) {
      if(!quiz.correct_answer || (quiz.correct_answer && quiz.correct_answer == answer.answer)) {
        recompenseUser(answer._user, quiz.points);

        answer.approved = true;
        answer.save(function(err) {
          console.log("Resposta correta");
        });
      }
    }
  });
}

var recompenseUser = function(user_id, points) {
  User.findById(user_id, function(err, user) {
      if (user) {
        user.points += points;
        user.save(function(err) {
          console.log("Usuário recompensado");
        });
      }
  });
}

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
        res.status(200).send(quiz_answer);
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