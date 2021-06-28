// CHATBOX
document.getElementById('chatbox_input').onfocus = function() {
    document.getElementById('chatbox').style.background = 'rgba(0,0,0,0.6)'
    document.getElementById('chatbox').style.height = '320px';
    document.getElementById('chatbox').style.width = '230px';
    document.getElementById('chatbox').style.padding = '10px';
}
document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement
    if (target.id != 'chatbox_input') {
        document.getElementById('chatbox').style.background = 'rgba(0,0,0,0.2)'
        document.getElementById('chatbox').style.height = '0px';
        document.getElementById('chatbox').style.padding = '0px';
        document.getElementById('chatbox').style.width = '250px';
    }
}, false);
document.addEventListener("keydown", chatkey);
function chatkey(e) {
    if (e.keyCode == 191) {
        document.getElementById('chatbox_input').focus()
        setTimeout(function(){
            if (document.getElementById('chatbox_input').value == '/') {
                document.getElementById('chatbox_input').value = ''
            }
        },1);
    } else if (e.keyCode == 27) {
        document.getElementById('chatbox_input').blur()
        document.getElementById('chatbox').style.background = 'rgba(0,0,0,0.2)'
        document.getElementById('chatbox').style.height = '0px';
        document.getElementById('chatbox').style.padding = '0px';
        document.getElementById('chatbox').style.width = '250px';
    }
}