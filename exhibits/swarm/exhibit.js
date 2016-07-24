let $canvas = document.querySelector('.canvas');
let swarms = {};
let colours = ['#D92120', '#D9AD3C', '#488BC2', '#781C81', '#B5BD4C', '#55A1B1', '#E6642C', '#63AD99',
    '#E68E34', '#413B93', '#7FB972', '#4065B1'].reverse();

SE.onVisitorJoin(function(v) {
    if (SE.visitors.length > 15) return;
    swarms[v] = createSwarm(12, v);
    SE.send({ colour: swarms[v].colour }, v);
});

SE.onVisitorLeave(function(v) {
    if (!(v in swarms)) return;
    colours.push(swarms[v].colour);
});

SE.onReceive(function(data, visitor) {
    if (!(visitor in swarms)) return;
    if ('attraction' in data) swarms[visitor].data.attraction = data.attraction;
    if ('repulsion' in data) swarms[visitor].data.repulsion = data.repulsion;
    if ('speed' in data) swarms[visitor].data.speed = data.speed;
});

function animate(callback) {
    let lastTime = Date.now();
    function tick() {
        let time = Date.now();
        callback(time - lastTime);
        lastTime = time;
        window.requestAnimationFrame(tick);
    }
    tick();
}

// ---------------------------------------------------------------------------------------------------------------------

let fish = [];
let width = window.innerWidth;
let height = window.innerHeight;

function createSwarm(n, visitor) {
    let colour = colours.pop();
    colours.unshift(colour);
    let center = [100 +  Math.random() * (width - 200), 100 +  Math.random() * (height - 200)];
    let swarm = [];
    let data = { attraction: 1, repulsion: 1, speed: 1 };

    for (let i=0; i<n; ++i) {
        let p = { x: center[0] + 200 * (Math.random() - 0.5), y: center[1] + 200 * (Math.random() - 0.5) };
        let v = { x: Math.random() - 0.5, y: Math.random() - 0.5 };

        let el = document.createElement('div');
        el.style.color = colour;
        $canvas.appendChild(el);

        let f = { p, v, el, a: { x: 0, y: 0 }, data, visitor };
        fish.push(f);
        swarm.push(f);
    }

    return { data, fish: swarm, colour };
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a.p.x - b.p.x, 2) + Math.pow(a.p.y - b.p.y, 2));
}

function bound(x, l, u) {
    return Math.min(Math.max(x, l), u);
}

function average(points, value) {
    let totalX = points.reduce((a, b) => a + b[value].x, 0);
    let totalY = points.reduce((a, b) => a + b[value].y, 0);
    return { x: totalX / points.length, y: totalY / points.length};
}

function update() {
    for (let f of fish) {

        let ctr=0;
        for (let g of fish){
            if (f===g) continue;

            let dist = Math.sqrt(Math.pow(f.p.x-g.p.x,2) + Math.pow(f.p.y-g.p.y,2));
            let vec = { x: f.p.x-g.p.x, y: f.p.y-g.p.y };

            if (f.visitor == g.visitor && (dist < 100 + 200 * f.data.attraction) && ctr < 5) {
                ctr++;
                f.v.x -= f.data.attraction * vec.x/(dist+100);
                f.v.y -= f.data.attraction * vec.y/(dist+100);
            }

            if(f.visitor == g.visitor && (dist < 200 + 200 * f.data.attraction) && ctr > 5) {
                f.a.x += f.data.attraction * 100 * vec.x;
                f.a.y += f.data.attraction * 100 * vec.y;
            }

            if (dist < 50 + 50 * f.data.repulsion){
                f.v.x += f.data.repulsion * 2*vec.x/(dist+100);
                f.v.y += f.data.repulsion * 2*vec.y/(dist+100);
            }

            if (dist < 10 + 15 * f.data.repulsion){
                f.v.x += f.data.repulsion * 100*vec.x/(dist+100);
                f.v.y += f.data.repulsion * 100*vec.y/(dist+100);
            }
        }

        // Pull towards middle:
        f.a.x -= 0.000001 * (f.p.x - 500);
        f.a.y -= 0.000001 * (f.p.y - 500);

        // Normalise
        var norm = Math.sqrt(Math.pow(f.v.x,2) + Math.pow(f.v.y,2));
        if (norm>2 || norm<0.5) {
            f.v.x= 8 * f.v.x/norm;
            f.v.y= 8 * f.v.y/norm;
        }

        // Bouncing
        if (f.p.y<150) f.v.y += 1;
        if (f.p.x<150) f.v.x += 1;
        if (f.p.y>850) f.v.y -= 1;
        if (f.p.x>850 ) f.v.x -= 1;

        f.p.x += 0.5 * f.v.x * f.data.speed;
        f.p.y += 0.5 * f.v.y * f.data.speed;

        f.v.x += 0.5 * f.a.x;
        f.v.y += 0.5 * f.a.y;

        let r = Math.atan2(-f.v.y, -f.v.x);
        f.el.style.transform = `translate(${f.p.x}px, ${f.p.y}px) rotate(${r}rad)`;
    }
}

// ---------------------------------------------------------------------------------------------------------------------

createSwarm(12, 'x');
createSwarm(12, 'y');
animate(update);
