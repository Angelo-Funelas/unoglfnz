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
    socket.on('uno_mech_start', uno_mech_start);
    socket.on('uno_mech_finish', uno_mech_finish);
    socket.on('gameStarted', gameStarted);
    socket.on('RoomsData', UpdateRooms);
    //Client Events
    socket.on('disconnect', disconnect);
    socket.on('connect', connected)
};
setup();
function connected() {
    document.getElementById('loader').style.display = 'none';
}
//When client gets disconnected from server
function disconnect(){
    document.getElementById('loader').style.display = 'block';
    if (document.getElementById('main_menu').style == 'none') {
        switchState('main_menu')
    }
    Show_Popup('You have been disconnected from the server');
}
//Shows Popup
function Show_Popup(message){
    switchState('main_menu');
    document.getElementById('PopupMessage').innerText = message;
    document.getElementById('Popup').style.display = "block";
}
function Close_Popup() {
    document.getElementById('Popup').style.display = "none";
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
        if (state == 'main_menu')  {
            document.getElementById('menumusic').play()
            document.body.style.background = 'linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(47,54,64,1) 100%)';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
        }
    }, 800);
    document.getElementById('gamemusic').pause();
}
//Update Public Rooms Display
function UpdateRooms(data) {
    document.getElementById('main_menu_sidebar').innerHTML = "";
    for(var i=0; i < data.length; i++) {
        // /roomname, size, status, owner, color
        addRoom(data[i].roomname,data[i].size,data[i].status,data[i].owner,data[i].color)
    }
    if (data.length != 0 || data.length <= 4) {
        for(var i=0; i < 4-data.length; i++) {
            // /roomname, size, status, owner, color
            addRoom('-----','-','-----','/static/uno/game_assets/gradient_anim.gif','-----')
        }
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
    if ( (this.dataset.filename == 'plus4') || (this.dataset.filename == 'chngclr') ) {
        SelectColor(this.dataset.filename)
    }
    socket.emit('placeCard', card_info);
}
//Places a card on the client's screen
function placeCardClient(data){
    var new_card = document.createElement("img");
    var folder = data.folder;
    var filename = data.filename;
    var randomRotation = Math.random() * (360 - 0);
    var top = Math.random() * (53 - 47) + 47;
    var left = Math.random() * (53 - 47) + 47;
    new_card.className = 'table_card';
    new_card.src = `/static/uno/card_styles/${window.card_style}/${folder}/${filename}.png`;
    new_card.style.transform = `rotate(${randomRotation}deg)`;
    new_card.style.top = `${top}%`;
    new_card.style.left = `${left}%`;
    new_card.draggable = false;
    playsound('place_sfx');
    document.getElementById('table_card_container').appendChild(new_card);
    window.tablecard = {
        "folder": folder,
        "filename": filename
    }
    updatePlayableCards()
    if(folder == 'red') {var color = '#B7161E'}
    else if(folder == 'yellow') {var color = '#CCB000'}
    else if(folder == 'green') {var color = '#007237'}
    else if(folder == 'blue') {var color = '#0074A5'}
    bg_transition(color)
}
function updatePlayableCards() {
    var cards = $("#playerhand > img");
    for(var i = 0; i < cards.length ; i++) {
        var card = cards[i];
        var cardfolder = card.src.split("/")[7];
        var cardnum = card.src.split("/")[8].split(".")[0];
        console.log(`${cardfolder} - ${cardnum}`)
        if ( ((cardnum == tablecard.filename) || (cardfolder == 'specials') || (tablecard.folder == cardfolder)) && (card.style.animationPlayState != 'running') ) {
            card.setAttribute('onclick','placeCardServer.call(this)');
        } else {
            card.setAttribute('onclick','');
        }
    };
    //filter: grayscale(100%);
}
function updatePlayers(data){
    playsound('join_sfx');
    document.getElementById('opponents-container').innerHTML = "";
    console.log(data);
    for(var i = 0; i < data.length ; i++) {
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
function toggleCC(stat) {
    $('#profile_creation_container').fadeToggle(200)
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
        document.getElementById('main_menu_error').innerText = "";
    } else {
        document.getElementById('main_menu_error').innerText = "Name or room name is invalid.";
    }
}
function confirmedRoomJoin(data) {
    switchState('play_area')
    document.getElementById('table_card_container').innerHTML = '';
    document.getElementById('game_table_board-dimmer').style.display = 'block';
    document.getElementById('playerhand').innerHTML = '';
    document.getElementById('chatbox').innerHTML = '';
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
    var hand = document.getElementById('play_area')
    var draw_card = document.createElement("img");
    draw_card.src = src;
    draw_card.className = 'uno_draw_animation';
    draw_card.addEventListener("animationend", function() {this.remove()});
    hand.appendChild(draw_card);
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
            requestCard()
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
async function recieveCard(data){
    var hand = document.getElementById('playerhand')
    var new_card = document.createElement("img");
    var folder = data.folder;
    var filename = data.card;
    new_card.className = 'card';
    new_card.dataset.filename = filename;
    new_card.dataset.folder = folder;
    new_card.setAttribute('onclick','placeCardServer.call(this)');
    new_card.addEventListener("animationend", function() {this.remove(); sendPlayerData()});
    new_card.src = `/static/uno/card_styles/${window.card_style}/${folder}/${filename}.png`;
    new_card.draggable = false;
    new_card.onmouseover = function(){sendHover(this)};
    drawAnimation('self', new_card.src);
    playsound('card_sfx');
    hand.appendChild(new_card);
    sendPlayerData()
    updatePlayableCards()
}
function validateMessage() {
    var chatbox = document.getElementById('chatbox_input')
    Message('send', chatbox.value)
    chatbox.value = '';
    return false
}
function Message(type, message) {
    if (type == 'send') {
        socket.emit('message', `[${window.nickname}]: ${message}`);
    } else {
        document.getElementById('chatbox').innerHTML += `<br>${message}`;
        $('#chatbox').animate({scrollTop: $('#chatbox').prop("scrollHeight")}, 500);
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
function gameStarted(){
    var gamemusic = document.getElementById('gamemusic');
    gamemusic.currentTime = 0;
    gamemusic.play();
    document.getElementById('game_table_board-dimmer').style.display = 'none';
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
        cut_back.src = `/static/uno/card_styles/${card_style}/specials/back.png`;
        cut_back.style.marginRight = '-10px';
        opponent_hand.appendChild(cut_back);
    }
}
//bg transition
function bg_transition(color) {
    var playarea = document.getElementById('play_area')
    var transitioner = document.createElement("div");
    transitioner.className = 'bg_transition';
    transitioner.style.background = color;
    transitioner.addEventListener("animationend", function() {this.remove(); document.body.style.background = color;});
    playarea.appendChild(transitioner);
}
//menu music
function readMessage() {
    if (getCookie('volume') != "") {
        $('#menumusic')[0].play();
        $('#menumusic')[0].volume = getCookie('volume');
        $('#gamemusic')[0].volume = getCookie('volume');
        document.getElementById('volume_slider').value = getCookie('volume')*100;
    } else {
        document.cookie = 'volume=60';
        readMessage()
    }
}
function UpdateVolume(volume) {
    var newvolume = volume/100;
    var menu_music = document.getElementById('menumusic');
    var game_music = document.getElementById('gamemusic');
    menu_music.volume = newvolume;
    game_music.volume = newvolume;
    document.cookie = `volume=${newvolume}`;
}