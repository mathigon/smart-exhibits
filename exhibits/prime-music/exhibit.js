let visitorPrimes = {};
let missingPrimes = [7, 6, 5, 4, 3, 2];

let $grid = document.querySelector('.number-grid');
let colours = { 2: '#c00', 3: '#0c0', 4: '#00c', 5: '#cc0', 6: '#0cc', 7: '#c0c' };
let interval;
let $current;


SE.onReceive(function(data, visitor) {
    if (data === 'join') {
        let p = missingPrimes.pop();
        visitorPrimes[visitor] = p;
        SE.send({number: p}, visitor);
    }
});

SE.onVisitorLeave(function(visitor) {
    missingPrimes.push(visitorPrimes[visitor]);
});

function start() {
    let i = 1;

    interval = setInterval(function() {
        if (i == 100) { clearInterval(interval); }
        if ($current) $current.classList.remove('active');
        $current = $grid.children[i-1];
        $current.classList.add('active');
        i += 1;
    }, 500);
}

document.querySelector('button').addEventListener('click', function() {
    for (let v of SE.visitors) SE.send({ start: true, number: visitorPrimes[v] }, v);
    start();
});
