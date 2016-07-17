var socket = io('/visitor');
socket.emit('join', SE.room);

var SE = {
    room: SE.room,
    send: data => { socket.emit('event', data); },
    onReceive: fn => { socket.on('event', fn);}
};
