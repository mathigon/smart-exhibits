let current = document.querySelector('.current');
let ready = false;

for (let slider of document.querySelectorAll('label')) {
    let id = slider.id;
    let label = slider.querySelector('span');

    slider.querySelector('input').addEventListener('input', function() {
        if (ready) SE.send({ [id]: Math.pow(2, this.value) });
    });
}

SE.onReceive(function(data) {
    document.querySelector('body').style.background = data.colour;
    ready = true;
});
