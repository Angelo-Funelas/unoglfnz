// Temporary Card Style
window.card_style = 'classic';

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
//profile choose menu
function LoadProfiles() {
    const profilepictures = ['barbara', 'eula', 'fischl', 'ganyu', 'hutao', 'keqing', 'klee', 'mona', 'noel', 'qiqi', 'sucrose']
    for(var i = 0; i < profilepictures.length ; i++) {
        var ppcontainerpics = document.getElementById('profile_container_pics')
        var avatar = document.createElement("img");
        avatar.src = `/static/uno/game_assets/profiles/${profilepictures[i]}.jpg`;
        avatar.className = 'user_profile_icon_listed';
        avatar.onclick = function() {document.getElementById("user_profile_icon").src = this.src;};
        ppcontainerpics.appendChild(avatar);
    }
}
LoadProfiles()
//Functions for maths
function getrandomint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//sets profile picture randomly
function Client_RandomPP() {
    const profilepictures = ['barbara', 'eula', 'fischl', 'ganyu', 'hutao', 'keqing', 'klee', 'mona', 'noel', 'qiqi', 'sucrose'];
    document.getElementById("user_profile_icon").src = `/static/uno/game_assets/profiles/${profilepictures[getrandomint(0,10)]}.jpg`;
}
function SetDefaultsFromCookies() {
    document.getElementById('user_profile_name').value = getCookie('nickname');
    document.getElementById('user_profile_container').style.background = getCookie('color');
    if (getCookie('pp') != "") {
        document.getElementById("user_profile_icon").src = getCookie('pp')
    } else {
        Client_RandomPP();
        Client_RandomNameCard();
    }
}
SetDefaultsFromCookies()
function Client_Namecards() {
    const colors = ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1', '#5f27cd']
    for(var i = 0; i < colors.length ; i++) {
        var container = document.getElementById('namecard_container')
        var namecard = document.createElement("div");
        namecard.style.background = colors[i];
        namecard.className = 'user_profile_container_listed';
        namecard.onclick = function() {document.getElementById("user_profile_container").style.background = this.style.background;};
        container.appendChild(namecard);
    }
}
Client_Namecards()
function Client_RandomNameCard() {
    const colors = ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1', '#5f27cd'];
    document.getElementById("user_profile_container").style.background = colors[getrandomint(0,5)];
}
//ToggleSettings
function ToggleSettings() {
    $('#settings_container').fadeIn(200)
}
//Popups
except = document.getElementById('settings_container');
except2 = document.getElementById('profile_creation_container');
except3 = document.getElementById('user_profile_icon');
except4 = document.getElementById('settings_icon');

document.addEventListener("click", function () {
    $('#settings_container').fadeOut(200);
    $('#profile_creation_container').fadeOut(200);
}, false);
except.addEventListener("click", function (ev) {
    ev.stopPropagation();
}, false);
except2.addEventListener("click", function (ev) {
    ev.stopPropagation();
}, false);
except3.addEventListener("click", function (ev) {
    ev.stopPropagation();
}, false);
except4.addEventListener("click", function (ev) {
    ev.stopPropagation();
}, false);

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

const card_styles = ['classic']
const card_types = ['red', 'yellow', 'green', 'blue']
const card_values = ['0','1','2','3','4','5','6','7','8','9','chngclr','plus2','plus4','reverse','stop']

//
function addRoom(roomname, size, status, owner, color) {
    //Container
    var container = document.createElement("div");
    container.className = 'room_item';
    //Avatar
    var avatar = document.createElement("img");
    avatar.src = owner
    container.appendChild(avatar);
    //roomname
    var roomnamespan = document.createElement("span");
    roomnamespan.innerText = roomname;
    roomnamespan.className = 'room_item_detail';
    roomnamespan.style.background = color;
    container.appendChild(roomnamespan);
    //size
    var sizespan = document.createElement("span");
    sizespan.innerText = `${size} Players`;
    sizespan.className = 'room_item_detail';
    container.appendChild(sizespan);
    //status
    var statusspan = document.createElement("span");
    statusspan.innerText = status;
    statusspan.className = 'room_item_detail';
    container.appendChild(statusspan);
    //button
    var button = document.createElement("button");
    var buttonspan = document.createElement("span");
    button.onclick = function() {document.getElementById('roomNameInput').value = this.parentElement.getElementsByClassName('room_item_detail')[0].innerText; createRoom()};
    button.className = 'pushable';
    button.id = 'Play_Button';
    buttonspan.className = 'front';
    buttonspan.innerText = 'Join';
    button.appendChild(buttonspan);
    container.appendChild(button);
    button.disabled = false;
    if (status == '-----') {
        buttonspan.style.background = '#a4b0be';
        buttonspan.style.textDecoration = 'line-through';
        button.style.background = '#747d8c';
        button.disabled = true;
        roomnamespan.style.background = '#747d8c';
    }
    //append to sidebar
    document.getElementById('main_menu_sidebar').appendChild(container);
}