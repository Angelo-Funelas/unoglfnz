function SelectColor() {
    document.getElementById('chngclr_container').style.display = 'block';
}
function SelectedColor(color) {
    socket.emit('changecolor', color);
    document.getElementById('chngclr_container').style.display = 'none';
}
socket.on('changecolor', changecolor);
function changecolor(color) {
    var topcard = document.getElementById('table_card_container').lastChild;
    var filename = topcard.src.split("/")[8]
    topcard.src = `/static/uno/card_styles/${window.card_style}/${color}/${filename}`;
    window.tablecard = {
        "folder": color,
        "filename": filename
    };
    if(color == 'red') {var color = '#B7161E'}
    else if(color == 'yellow') {var color = '#CCB000'}
    else if(color == 'green') {var color = '#007237'}
    else if(color == 'blue') {var color = '#0074A5'}
    bg_transition(color);
    updatePlayableCards()
}
