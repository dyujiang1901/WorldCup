/**
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , player = require('./routes/player')
  , user = require('./routes/user')
  , others = require('./routes/others')
  , others_q = require('./routes/others_q')
  , teamDetail = require('./routes/teamDetail')
  , team = require('./routes/team')
  , map = require('./routes/map')
  , http = require('http')
  , path = require('path')
  , stylus = require("stylus")
  , nib = require("nib")
  , bodyParser = require("body-parser");
;

// Initialize express
var app = express();
// .. and our app
init_app(app);

// When we get a request for {app}/ we should call routes/index.js
app.get('/', routes.do_work);
app.get('/team', team.do_work);
app.get('/teamDetail', teamDetail.do_work);
app.get('/searchplayer', player.init);
app.get('/players', player.do_work);
app.get('/player', player.details);
app.get('/tweets', function(req, res){res.render('twitter.jade',{title:'Latest Tweets'})});
app.get('/others', others_q.do_work_q);
app.get('/others_a0', others.do_work_a0);
app.get('/others_a4', others.do_work_a4);
app.get('/others_a1', others.do_work_a1);
app.get('/others_a2', others.do_work_a2);
app.get('/others_a3', others.do_work_a3);
app.get('/map', map.do_work);
app.post('/userData',user.do_work);




// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//////
// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 8080);
	
	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.favicon());
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	app.use(express.static(path.join(__dirname, 'public')));


	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

}