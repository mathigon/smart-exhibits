const cindy = createCindy({ canvasname: 'cindy-canvas', movescript: 'cindy-script' });

SE.onReceive(function(data, visitor) {
    cindy.evokeCS(`n=${data};`);
});
