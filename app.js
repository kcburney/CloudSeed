var express    = require('express'); 		// call express
var https      = require('https');
var fs         = require('fs');
var bodyParser = require('body-parser');
var path       = require('path');
var favicon    = require('serve-favicon');
global.config  = require('./config.json');
var app        = express(); 			// define our app using express




app.set('view engine','html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'client')));
app.set('views', __dirname + '/client/views');
app.use(bodyParser.json())
app.use(favicon(__dirname + '/favicon.ico'));

var port = 3000;

// ROUTES FOR OUR API
// =============================================================================
//

app.get('/', function(req, res){
  res.render('index');
});

app.use('/api/', require('./routes/api.js'));

//keep this last, as it will return 404
app.use(function(req, res, next){
  res.status(404);
  // respond with html page
  if (req.accepts('html')) {
    return res.render('404', { url: req.url });
  }
  // respond with json
  if (req.accepts('json')) {
    return res.send({error: 'Not a valid endpoint'});
  }
  // default to plain-text. send()
  return res.type('txt').send('Not found');
});

if('SSL' in global.config){
  var config = {
    key: fs.readFileSync(global.config.SSL.keyfile),
   cert: fs.readFileSync(global.config.SSL.certfile)
  };
  https.createServer(config, app).listen(port);
}
else{
  app.listen(port);
}
console.log('Magic happens on port ' + port);
