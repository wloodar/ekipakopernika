const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const parseArgs = require('minimist');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const serveStatic = require('serve-static');
const cors = require('cors');

const { ErrorHandler, handleError } = require('./api/components/Error/Error');

const http = require('http');
const server = http.createServer(app);
const args = parseArgs(process.argv.slice(2));
const { name = 'default', port='5000' } = args;
require('dotenv').config();

// App configuration
app.use('/api/uploads', serveStatic(path.join(__dirname, '/uploads'), {
    maxAge: '1d'
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.sendStatus(400); // Bad request
    }

    next();
});


// * App Routes
const administratorRoutes = require('./api/routes/admin');
const appRoutes = require('./api/routes/app');

// Admin
app.use('/api/admin35428/', administratorRoutes);
app.use('/api/app/', appRoutes);

var sockets = require('./api/sockets/SocketManager');
sockets.init(server, port);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json(err);
});

server.listen(+port, '0.0.0.0', (err) => {
    if (err) {
        console.log(err.stack);
        return;
    }
    console.log(`Node [${name}] listens on http://127.0.0.1:${port}.`);
});