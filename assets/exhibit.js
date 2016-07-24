var socket = io('/exhibit');
socket.emit('join', SE.room);

var SE = {
    room: SE.room,
    visitors: [],
    send: (data, visitor=null) => { socket.emit('event', { data, visitor }); },
    onReceive: fn => { socket.on('event', ({data, visitor}) => fn(data, visitor)); },
    onVisitorJoin: fn => { socket.on('visitor-join', fn); },
    onVisitorLeave: fn => { socket.on('visitor-leave', fn); }
};

socket.on('visitor-join', function(id) {
    SE.visitors.push(id);
});

socket.on('visitor-leave', function(id) {
    SE.visitors = SE.visitors.filter(x => x != id);
});

document.addEventListener('keydown', function(e) {
    if (e.keyCode !== 13) return;

    if (!document.webkitFullscreenElement) {
        document.documentElement.webkitRequestFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
});
