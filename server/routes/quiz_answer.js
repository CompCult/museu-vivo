var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
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

//Show
router.get('/:answer_id', function(req, res) {
  QuizAnswer.find({ _id: req.params.answer_id }, function(err, answer) {
    if (err) {
      res.status(400).send(err);
    } else if(!answer) {
      res.status(404).send('Resposta não encontrada');
    } else {
      let answer_complete = inject_data(answer);

      res.status(200).send(answer_complete);
    }
  });
});


var inject_data = async function(answer) {
  let string = JSON.stringify(answer);
  let answer_complete = JSON.parse(string);

  let user_obj = await User.findById(answer._user).exec();
  let quiz_obj = await Quiz.findById(answer._quiz).exec();

  answer_complete._user = user_obj;
  answer_complete._quiz = quiz_obj;

  return answer_complete;
}

//Find by params
router.get('/query/fields', function(req, res) {
  QuizAnswer.find(req.query, function(err, answers) {
    if (err) {
      res.status(400).send(err);
    } else if (!answer){
      res.status(404).send("Resposta do quiz não encontrada");
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