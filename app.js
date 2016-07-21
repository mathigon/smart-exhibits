// =============================================================================
// Mathigon Server Configuration
// (c) 2016 Mathigon
// =============================================================================



const fs = require('fs');
const path = require('path');
const express = require('express');
const compress = require('compression');
const favicon = require('serve-favicon');
const socketio = require('socket.io');


// -----------------------------------------------------------------------------
// Express Configuration

const port = (+process.env.PORT) || 8081;
const env = process.env.NODE_ENV || 'development';
const app = express();

app.set('port', port);
app.set('env', env);
app.set('trust_proxy', true);
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'jade');


// -----------------------------------------------------------------------------
// Static Files Routing

app.get('/_ah/health', function (req, res) { res.status(200).send('ok'); });

app.use(compress());
// app.use(favicon(path.join(__dirname, 'build/favicon.ico')));
app.use(express.static(path.join(__dirname, 'build/assets')));
app.use('/vendor', express.static(path.join(__dirname, 'vendor')));


// -----------------------------------------------------------------------------
// Routing

app.get('/', function(req, res) { res.render('home'); });

const rooms = fs.readdirSync(path.join(__dirname, 'exhibits')).filter(function(file) {
    return fs.statSync(path.join(__dirname, 'exhibits', file)).isDirectory();
});

for (let e of rooms) {
    app.get('/' + e, function(req, res) {
        res.render('../exhibits/' + e + '/visitor', { room: e, type: 'visitor' });
    });
    app.get('/' + e + '/display', function(req, res) {
        res.render('../exhibits/' + e + '/exhibit', { room: e, type: 'exhibit' });
    });
    app.use('/' + e, express.static(path.join(__dirname, 'build/exhibits', e)));
}

app.use(function(req, res) {
    res.status(404);
    res.render('error', { code: 404, url: req.url });
});

app.use(function(error, req, res) {
    res.status(500);
    res.render('error', { code: 500, error: error, url: req.url });
});

const server = app.listen(port, function() { console.log('Server listening on port %s', port); });


// -----------------------------------------------------------------------------
// Socket IO

const io = socketio.listen(server);
const exhibits = io.of('/exhibit');
const visitors = io.of('/visitor');

exhibits.on('connection', function(socket) {
    let room = null;

    socket.on('join', function(data) {
        if (room) return;
        room = data;
        socket.join(room);
    });

    socket.on('event', function({ data, visitor }) {
        if (!room) return;
        // TODO If visitor is specified, we should still also filter by room.
        visitors.in(visitor ? '/visitor' + visitor : room).emit('event', data);
    });

    socket.on('disconnect', function() {
        if (!room) return;
        socket.leave(room);
        visitors.in(room).emit('error', { msg: 'Exhibit offline' });
    });
});

visitors.on('connection', function(socket) {
    let room = null;
    let id = socket.id.replace('/visitor', '');

    socket.on('join', function(data) {
        if (room) return;
        room = data;
        socket.join(room);
        exhibits.in(room).emit('visitor-join', id);
    });

    socket.on('event', function(data) {
        if (!room) return;
        exhibits.in(room).emit('event', { data: data, visitor: id });
    });

    socket.on('disconnect', function() {
        if (!room) return;
        socket.leave(room);
        exhibits.in(room).emit('visitor-leave', id);
    });
});
