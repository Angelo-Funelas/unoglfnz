var loadedassets = 0;
var preload = document.getElementsByClassName("preload");
for (var i = 0; i < preload.length; i++) {
    preload[i].onload = preload_assets();
}

function preload_assets() {
    var display = document.getElementById('loading_assets');
    loadedassets += 1;
    display.innerText = `Loading Assets ${loadedassets}/${preload.length}`;
}
var images = document.getElementsByTagName('img');
for(var i = 0; i < images.length; i++) {
    images[i].draggable = false;
}