var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var app = express(),

//sign in
sessions = require('client-sessions'),
passport = require('passport'),
bodyParser = require('body-parser');
var flash = require('connect-flash'); 

app.use(passport.initialize());
app.use(passport.session());

//session
app.use(sessions({
	cookieName: 'session',
	secret: 'asdfgmirahjklmiraxpto',
	duration: 1 * 60 * 60 * 1000,
	activeDuration: 1000 * 60 * 5
}));
app.use(flash());

// cfenv provides access to your Cloud Foundry environment
var cfenv = require('cfenv');

//use Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//handlebars

var helpers = require("./server/helpers/router-helpers.js").helpers;
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs', helpers: helpers}));

app.set('view engine', '.hbs');
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use('/public',express.static(__dirname + '/public'));

//global variables

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
	console.log("server starting on " + appEnv.url);
	//init database
	console.log("[app] init database");
	var cloudant = require('./server/config/js/class-conn');
	// Connect to db in Bluemix if it's running over there; otherwise
	if (process.env.VCAP_SERVICES) {
		cloudant.connect('miradb');
	} else {
		cloudant.connect('miradbtest');
	} 
});

//Site variables

app.use(require('./server/lib/auth'));
app.use(require('./server/config/router.js'));
app.use(require('./server/config/router-security.js'));
app.use(require('./server/config/router-administration.js'));
app.use(require('./server/config/router-calendars.js'));
app.use(require('./server/config/router-interface.js'));


/* Redirect to an error page if no page exists */
app.get('*', function (req, res) {
    res.render('error',{errorDescription: req.url + ' does not exist.'});
}); 
