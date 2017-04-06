let express = require('express');
let bodyParser = require('body-parser');
require('./db');
let app = express();

app.use(require('./cors'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/auth', require('./api/auth'));
app.use('/api', require('./api/methods'));
app.use('/api', require('./api/tags'));
let groups = require('./api/groups');
app.use('/api', groups);
app.listen(3003, function() {
    console.log('methods server is listening on port 3003!')
});


