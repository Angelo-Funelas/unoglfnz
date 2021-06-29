var preload_card_styles = ['classic']
var preload_card_types = ['red', 'yellow', 'green', 'blue']
var preload_card_values = ['0','1','2','3','4','5','6','7','8','9','chngclr','plus2','plus4','reverse','stop']

sources = []
for(var i = 0; i < preload_card_values.length ; i++) {
    for(var j = 0; j < preload_card_types.length ; j++) {
        for(var k = 0; k < preload_card_styles.length ; k++) {
            sources.push(`/static/uno/card_styles/${preload_card_styles[k]}/${preload_card_types[j]}/${preload_card_values[i]}.png`);
        }
    }
}
function preload_game_assets() {
    for(var i = 0; i < sources.length ; i++) {
        var img = new Image();
        img.onload = preload_assets();
        img.src = sources[i];
    }
}
document.getElementById('loading_assets_loadingbar').max = sources.length;
function preload_assets() {
    loadedassets += 1;
    var widthpercent = (loadedassets/sources.length)*100;
    if (loadedassets == sources.length) {
        setTimeout(function() {
            document.getElementById('iunderstand').style.display = 'block';
        }, 2000)
    }
    document.getElementById('loading_assets_loadingbar').getElementsByTagName('div')[0].style.width = `${widthpercent}%`;
}
document.addEventListener("DOMContentLoaded", function(){
    setTimeout(function() {preload_game_assets()}, 1000)
});