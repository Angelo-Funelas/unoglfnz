var socket;
function setup() {
    //socket = io.connect('https://unoglfnz.herokuapp.com/');
    socket = io.connect('http://localhost:3000/');
    //Server Events
    socket.on('UpdateGame', UpdateGame);
    socket.on('updatePlayers', updatePlayers);
    socket.on('ClientID', setClientID);
    socket.on('placeCardFromServer', placeCardClient);
    socket.on('recieveCard', recieveCard);
    socket.on('Popup', Show_Popup);
    socket.on('confirmedRoomJoin', confirmedRoomJoin);
    socket.on('roomstartederror', roomstartederror);
    socket.on('updatePlayerCards', updatePlayerCards);
    socket.on('message', Message);
    socket.on('opponenthover', hoverCard);
    socket.on('uno_mech_start', uno_mech_start)
    socket.on('uno_mech_finish', uno_mech_finish)
    //Client Events
    socket.on('disconnect', disconnect);
};
setup();
//profile choose menu
function Client_RandomPP() {
    const profilepictures = ['barbara', 'eula', 'fischl', 'ganyu', 'hutao', 'keqing', 'klee', 'mona', 'noel', 'qiqi', 'sucrose']
    for(var i = 0; i < profilepictures.length ; i++) {
        var ppcontainerpics = document.getElementById('profile_container_pics')
        var avatar = document.createElement("img");
        avatar.src = `/static/uno/profiles/${profilepictures[i]}.jpg`;
        avatar.className = 'user_profile_icon_listed';
        avatar.onclick = function() {document.getElementById("user_profile_icon").src = this.src; toggleCC('hide')};
        ppcontainerpics.appendChild(avatar);
    }
    //sets profile picture randomly
    var randompicvar = Math.floor(Math.random() * (10 - 0) + 0);
    document.getElementById("user_profile_icon").src = `/static/uno/profiles/${profilepictures[randompicvar]}.jpg`;
}
Client_RandomPP()
function Client_Namecards() {
    const colors = ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1', '#5f27cd']
    for(var i = 0; i < colors.length ; i++) {
        var container = document.getElementById('namecard_container')
        var namecard = document.createElement("div");
        namecard.style.background = colors[i];
        namecard.className = 'user_profile_container_listed';
        namecard.onclick = function() {document.getElementById("user_profile_container").style.background = this.style.background; toggleCC('hide')};
        container.appendChild(namecard);
    }
}
Client_Namecards()
//document.body.addEventListener('click', documentClick, true); 
//function documentClick(){
//    $('#profile_container').fadeOut(0)
//}
//Shows Popup
function Show_Popup(message){
    switchState('main_menu');
    document.getElementById('PopupMessage').innerText = message;
    document.getElementById('Popup').style.display = "block";
}
function Close_Popup() {
    document.getElementById('Popup').style.display = "none";
}
//When client gets disconnected from server
function disconnect(){
    if (document.getElementById('main_menu').style == 'none') {
        switchState('main_menu')
    }
    Show_Popup('You have been disconnected from the server');
}
function switchState(state){
    var transition = document.createElement("div");
    transition.id = 'screenswitchtransitiondiv';
    document.getElementsByTagName('body')[0].appendChild(transition)
    setTimeout(function() {
        var allScreens = document.getElementsByClassName('screen');
        for(var i = 0; i < allScreens.length ; i++) {
            allScreens[i].style.display = "none";
        }
        document.getElementById(state).style.display = "block";
        document.getElementById('screenswitchtransitiondiv').remove()
        var rev_transition = document.createElement("div");
        rev_transition.id = 'screenswitchtransitionreversediv';
        rev_transition.addEventListener("animationend", function() {this.remove()});
        document.getElementsByTagName('body')[0].appendChild(rev_transition)
    }, 800);
    document.getElementById('gamemusic').pause();
    if (state == 'main_menu')  {
        document.getElementById('menumusic').play()
    }
    
}
//New Method of communicating with server.
function UpdateGame(data) {
    var action = data.action;
}
function setClientID(data){
    window.ClientID = data;
};
function placeCardServer(){
    this.setAttribute('onclick','');
    this.style.animationPlayState = 'running';
    var folder = this.dataset.folder;
    var filename = this.dataset.filename;
    var card_info = {
        folder: folder,
        filename: filename
    };
    socket.emit('placeCard', card_info);
}
function placeCardClient(data){
    var new_card = document.createElement("img");
    var folder = data.folder;
    var filename = data.filename;
    var randomRotation = Math.random() * (360 - 0);
    var top = Math.random() * (53 - 47) + 47;
    var left = Math.random() * (53 - 47) + 47;
    new_card.className = 'table_card';
    new_card.src = `/static/uno/${folder}/${filename}.png`;
    new_card.style.transform = `rotate(${randomRotation}deg)`;
    new_card.style.top = `${top}%`;
    new_card.style.left = `${left}%`;
    new_card.draggable = false;
    playsound('place_sfx');
    document.getElementById('table_card_container').appendChild(new_card);
}
function updatePlayers(data){
    playsound('join_sfx');
    document.getElementById('opponents-container').innerHTML = "";
    console.log(data);
    for(var i = 0; i < data.length ; i++){
        if(data[i].id != ClientID){
            var new_opponent = document.createElement("div");
            var opponent_container = document.createElement("div");
            var avatar = document.createElement("img");
            var name = document.createElement("span");
            name.className = 'user_profile_name';
            name.innerText = data[i].name;
            new_opponent.id = data[i].id;
            new_opponent.className = 'user_profile_container';
            new_opponent.style.background = data[i].color;
            avatar.src = data[i].pp;
            opponent_container.className = 'opponent_container_id';
            avatar.className = 'user_profile_icon';
            //Create opponent deck
            var hand = document.createElement("div");
            hand.className = 'opponent_hand';
            new_opponent.appendChild(avatar);
            new_opponent.appendChild(name);
            new_opponent.appendChild(hand);
            opponent_container.appendChild(new_opponent);
            document.getElementById("opponents-container").appendChild(opponent_container);
        }
    }
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
function SetDefaultsFromCookies() {
    document.getElementById("user_profile_icon").src = '/static/uno/profiles/hutao.jpg';
    document.getElementById('user_profile_name').value = getCookie('nickname');
    document.getElementById('user_profile_container').style.background = getCookie('color');
    if (getCookie('pp') != "") {
        document.getElementById("user_profile_icon").src = getCookie('pp')
    }
}
SetDefaultsFromCookies()
function toggleCC(stat) {
    var menu = document.getElementById('profile_creation_container')
    if (stat == 'show') {
        $('#profile_creation_container').fadeIn(200)
    } else if (stat == 'hide') {
        $('#profile_creation_container').fadeOut(200)
    }
}
function createRoom() {
    playsound('play_sfx');
    window.roomName = document.getElementById('roomNameInput').value;
    window.nickname = document.getElementById('user_profile_name').value;
    window.color = document.getElementById('user_profile_container').style.background;
    window.pp = document.getElementById("user_profile_icon").src;
    document.cookie = `nickname=${nickname}`;
    document.cookie = `color=${color}`;
    document.cookie = `pp=${pp}`;
    var menu_music = document.getElementById('menumusic');
    menu_music.pause();
    if(roomName != "" && nickname != ""){
        var join_info = {
            nickname: window.nickname,
            roomname: window.roomName,
            color: document.getElementById("user_profile_container").style.background,
            profilepic: document.getElementById("user_profile_icon").src
        }
        socket.emit('joinRoom', join_info)
        document.getElementById('roomID').value = roomName
        document.getElementById('main_menu_error').innerText = "";
    } else {
        document.getElementById('main_menu_error').innerText = "Name or room name is invalid.";
    }
}
function confirmedRoomJoin(data) {
    switchState('play_area')
    document.getElementById('table_card_container').innerHTML = '';
    document.getElementById('game_table_board').style.display = 'block';
    document.getElementById('playerhand').innerHTML = '';
    document.getElementById('Chat_Container').innerHTML = '';
    if(data == 'owner'){
        document.getElementById('startgame').style.display = 'block';
    } else {
        document.getElementById('startgame').style.display = 'none';
    }
}
function roomstartederror(){
    document.getElementById('main_menu_error').innerText = "Room game already started. Iniwan ka :'(";
}
function drawAnimation(owner, src) {
    if (owner == 'self') {
        var hand = document.getElementById('play_area')
        var draw_card = document.createElement("img");
        draw_card.src = src;
        draw_card.className = 'uno_draw_animation';
        draw_card.addEventListener("animationend", function() {this.remove()});
        hand.appendChild(draw_card);
    } else if (owner == 'opponent') {
    }
}
/* GAME MECHANICS AREA */
//Uno Mechanic
var startTime, endTime;
const keys = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
function checkkeypressed(event) {
    if (event.keyCode == randomkey+65) {
        uno_mech_end();
    }
}
function uno_mech_start(data) {
    console.log(`recieved uno mech signal`)
    var uno_p1 = data.uno_p1;
    var opponent = data.opponent;
    randomkey = data.keycode;
    uno_mech_player = '';
    if((ClientID == uno_p1) || (ClientID == opponent.id)) {
        if(ClientID == uno_p1) {
            uno_mech_player = 'uno_p1';
        } else {
            uno_mech_player = 'opponent';
        }
        if(typeof bailunomech !== 'undefined') {
            clearTimeout(bailunomech);
        }
        document.getElementById('uno_speed_prompt').style.display = 'block';
        startTime = new Date();
        var keyname = keys[randomkey];
        console.log(`${keyname.toUpperCase()}`)
        document.getElementById('key_inner').innerText = `${keyname.toUpperCase()}`;
        document.addEventListener("keydown", checkkeypressed);
        bailunomech = setTimeout(uno_mech_end, 5000)
    } else {
        
    }
};
function uno_mech_end() {
    playsound('uno_pre_sfx');
    endTime = new Date();
    var timeDiff = endTime - startTime;
    var data = {
        player: uno_mech_player,
        id: ClientID,
        speed: timeDiff
    }
    socket.emit('uno_mech_results', data)
    clearTimeout(bailunomech);
    document.removeEventListener("keydown", checkkeypressed);
    document.getElementById('uno_speed_prompt').style.display = 'none';
}
function uno_mech_finish(data) {
    if(data.winnerID == ClientID) {
        console.log('You won the uno_mech fight')
    } else if(data.loserID == ClientID) {
        console.log('You lost the uno_mech fight')
        if(data.plus == 'plus') {
            requestCard()
            requestCard()
        }
    }
    if(data.plus == 'noplus') {
        playsound('uno_sfx');
    }
    
}
//start the game
function startGame() {
    socket.emit('startGame');
}
//request from server
function requestCard(){
    socket.emit('requestCard');
}
//playsound function
function playsound(audioID) {
    document.getElementById(audioID).pause();
    document.getElementById(audioID).currentTime = 0;
    document.getElementById(audioID).play();
}
//Leave Room
function LeaveRoom() {
    switchState('main_menu');
    socket.emit('LeaveRoom');
}
//get card from deck
function recieveCard(data){
    var hand = document.getElementById('playerhand')
    var new_card = document.createElement("img");
    var folder = data.folder;
    var filename = data.card;
    new_card.className = 'card';
    new_card.dataset.filename = filename;
    new_card.dataset.folder = folder;
    new_card.setAttribute('onclick','placeCardServer.call(this)');
    new_card.addEventListener("animationend", function() {this.remove(); sendPlayerData()});
    new_card.src = `/static/uno/${folder}/${filename}.png`;
    new_card.draggable = false;
    new_card.onmouseover = function(){sendHover(this)};
    drawAnimation('self', new_card.src);
    playsound('card_sfx');
    hand.appendChild(new_card);
    sendPlayerData()
}
function validateMessage() {
    var chatbox = document.getElementById('ClientChatBox')
    Message('send', chatbox.value)
    chatbox.value = '';
    return false
}
function Message(type, message) {
    if (type == 'send') {
        socket.emit('message', `[${window.nickname}]: ${message}`);
    } else {
        document.getElementById('Chat_Container').innerHTML += `<br>${message}`;
        $('#Chat_Container').animate({scrollTop: $('#Chat_Container').prop("scrollHeight")}, 500);
    }
}
function sendPlayerData(){
    var cardn = $("#playerhand > img").length;
    console.log('You have ' + cardn + ' cards')
    var data = {
        cardn: cardn
    }
    socket.emit('updateCards', data)
}
//When server says game has started
socket.on('gameStarted', gameStarted);
function gameStarted(data){
    var gamemusic = document.getElementById('gamemusic');
    gamemusic.currentTime = 0;
    gamemusic.play();
    $('#menumusic')[0].volume = 0;
    document.getElementById('game_table_board').style.display = 'none';
    var handLoop = data.hand;
    for (let i = 0; i < handLoop; i++) {
        requestCard()
    }
}
//hover effects
function sendHover(card) {
    var cards = $("#playerhand > img");
    for(var i = 0; i < cards.length ; i++){
        if (cards[i] == card) {
            var data = {
                id: ClientID,
                i: i,
                cardn: cards.length
            }
            console.log(data)
            socket.emit('hovered', data)
        }
    }
}
function hoverCard(data) {
    var opponentcards = document.getElementById(data.id).getElementsByClassName('opponent_hand')[0].querySelectorAll('img');
    //opponent_hand.innerHTML = "";
    var cardn = data.cardn
    for(var i = 0; i < opponentcards.length ; i++){
        if (data.i == i) {
            opponentcards[i].style.marginRight = '5px';
            var card_hover = i;
        } else {
            opponentcards[i].style.marginRight = '-10px';
        }
    }
    resetopphand = setTimeout(function() {
        opponentcards[card_hover].style.marginRight = '-10px';
    }, 1000)
}
//When opponent's hand updates
function updatePlayerCards(data) {
    console.log(data)
    var opponent_hand = document.getElementById(data.id).getElementsByClassName('opponent_hand')[0];
    opponent_hand.innerHTML = "";
    var cardn = data.cardn
    for(var i = 0; i < cardn ; i++){
        var cut_back = document.createElement("img");
        cut_back.src = `/static/uno/specials/back.png`;
        cut_back.style.marginRight = '-10px';
        opponent_hand.appendChild(cut_back);
    }
}