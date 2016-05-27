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
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000
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
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use('/public',express.static(__dirname + '/public'));
//set variables
var varConf = require('./configuration');

//global variables
app.locals.submenus = require('./public/submenus.json');
//app.locals.varConf = varConf;

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
	console.log("server starting on " + appEnv.url);
	//init database
	console.log("[app] init database");
	var cloudant = require('./conn');
	cloudant.connect('miradb');
});

//Site variables
app.use(require('./server/lib/auth'));
app.use(require('./server/config/routes.js'));