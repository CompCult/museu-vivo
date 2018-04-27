// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var cors = require('cors');

// mongoose local
//mongoose.connect('mongodb://localhost/mean-auth');
// mongoose 
mongoose.connect('mongodb://atelier:Atelier1516@minha-arvore-shard-00-00-hv0nd.mongodb.net:27017,minha-arvore-shard-00-01-hv0nd.mongodb.net:27017,minha-arvore-shard-00-02-hv0nd.mongodb.net:27017/test?ssl=true&replicaSet=minha-arvore-shard-0&authSource=admin');

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// create instance of express
var app = express();

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//-------------------------------------------------------------------------
app.get('/', function(req, res) {
  res.send('This API is running, baby!');
});

// require routes
var general = require('./routes/general.js');
var users = require('./routes/user.js');
var missions = require('./routes/mission.js');
var missions_answer = require('./routes/mission_answer.js');
var quizzes = require('./routes/quiz.js');
var quizzes_answer = require('./routes/quiz_answer.js');
var groups = require('./routes/group.js');
var group_member = require('./routes/group_member.js');
var post = require('./routes/post.js');
var reaction = require('./routes/reaction.js');
var tree = require('./routes/tree.js');
var tree_request = require('./routes/tree_request.js');
var tree_type = require('./routes/tree_type.js');
var appointment = require('./routes/appointment.js');
var appointment_request = require('./routes/appointment_request.js');

// routes
app.use('/general', general);
app.use('/users', users);
app.use('/missions', missions);
app.use('/missions_answers', missions_answer);
app.use('/quizzes', quizzes);
app.use('/quiz_answers', quizzes_answer);
app.use('/groups', groups);
app.use('/group_members', group_member);
app.use('/posts', post);
app.use('/reactions', reaction);
app.use('/trees', tree);
app.use('/tree_requests', tree_request);
app.use('/tree_types', tree_type);
app.use('/appointment', appointment);
app.use('/appointment_requests', appointment_request);
//-------------------------------------------------------------------------

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
