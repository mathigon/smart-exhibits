let current = document.querySelector('.current');

document.querySelector('#slider').addEventListener('input', function() {
    current.textContent = this.value;
    SE.send(this.value);
});
