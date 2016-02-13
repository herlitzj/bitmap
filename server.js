// Dependencies
// -----------------------------------------------------
var express         = require('express');
var app             = express();
var mongoose        = require('mongoose');
var passport        = require('passport');
var port            = process.env.PORT || 5000;
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var session         = require('express-session');
var flash           = require('connect-flash');

// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/bitMapApp");

// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/bower_components',  express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Routes
// ------------------------------------------------------
require('./app/routes.js')(app, passport);

// Listen
// -------------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);