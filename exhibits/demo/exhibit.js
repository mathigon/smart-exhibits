SE.onVisitorJoin(function(visitor) {
    console.log('join', visitor);
});

SE.onVisitorLeave(function(visitor) {
    console.log('leave', visitor);
});

SE.onReceive(function(data, visitor) {
    console.log(data, visitor);
});

document.querySelector('#btn1').addEventListener('click', function() {
    SE.send('hello');
});

document.querySelector('#btn2').addEventListener('click', function() {
    for (let v of SE.visitors) SE.send('hello', v);
});
