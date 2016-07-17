document.querySelector('#btn').addEventListener('click', function() {
    SE.send('hello');
});

SE.onReceive(function(data) {
    console.log(data);
});
