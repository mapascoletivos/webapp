var express = require('express');
var app = express();

app.use('/', express.static(__dirname));

app.get('/*', function(req, res){
	res.sendfile('index.html');
});

// Start the app by listening on <port>
var port = process.env.PORT || 8000
app.listen(port)
console.log('Express app started on port '+port)