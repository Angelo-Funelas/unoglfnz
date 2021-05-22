var socket;
function setup(){
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
        avatar.className = 'mm_avatar ';
        avatar.onclick = function() {document.getElementById("ClientProfilePicture").src = this.src};
        ppcontainerpics.appendChild(avatar);
    }
    //sets profile picture randomly
    var randompicvar = Math.floor(Math.random() * (10 - 0) + 0);
    document.getElementById("ClientProfilePicture").src = `/static/uno/profiles/${profilepictures[randompicvar]}.jpg`;
}
Client_RandomPP()
document.body.addEventListener('click', documentClick, true); 
function documentClick(){
    $('#profile_container').fadeOut(0)
}
//Shows Popup
function Show_Popup(message){
    document.getElementById('PopupMessage').innerText = message;
    document.getElementById('Popup').style.display = "block";
}
function Close_Popup() {
    document.getElementById('Popup').style.display = "none";
    switchState('main_menu')
    document.getElementById('table_card_container').innerHTML = '';
}
//When client gets disconnected from server
function disconnect(){
    Show_Popup('You have been disconnected from the server');
}
function switchState(state){
    var allScreens = document.getElementsByClassName('screen');
    for(var i = 0; i < allScreens.length ; i++) {
        allScreens[i].style.display = "none";
    }
    document.getElementById(state).style.display = "block";
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
    document.getElementById('table_card_container').appendChild(new_card);
}
function updatePlayers(data){
    document.getElementById('opponents-container').innerHTML = "";
    console.log(data);
    for(var i = 0; i < data.length ; i++){
        if(data[i].id != ClientID){
            console.log('player ' + data[i].name + ' connected');
            var new_opponent = document.createElement("div");
            new_opponent.id = data[i].id;
            new_opponent.className = 'opponent_display';
            var avatar = document.createElement("img");
            avatar.src = data[i].pp;
            avatar.className = 'avatar';
            //Create opponent deck
            var hand = document.createElement("div");
            hand.className = 'opponent_hand';
            new_opponent.appendChild(avatar);
            new_opponent.innerHTML += data[i].name;
            new_opponent.appendChild(hand)
            document.getElementById("opponents-container").appendChild(new_opponent);
        }
    }
}
function createRoom() {
    window.roomName = document.getElementById('roomNameInput').value;
    window.nickname = document.getElementById('nickname').value;
    if(roomName != "" && nickname != ""){
        var join_info = {
            nickname: window.nickname,
            roomname: window.roomName,
            profilepic: document.getElementById("ClientProfilePicture").src
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
function drawAnimation(src) {
    var hand = document.getElementById('playerhand')
    var draw_card = document.createElement("img");
    draw_card.src = src;
    draw_card.className = 'uno_draw_animation';
    draw_card.addEventListener("animationend", function() {this.remove()});
    hand.appendChild(draw_card);
}
/* GAME MECHANICS AREA */
//start the game
function startGame() {
    socket.emit('startGame');
}
//request from server
function requestCard(){
    socket.emit('requestCard');
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
    drawAnimation(new_card.src);
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
        console.log(`recived message: ${message}`)
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
    document.getElementById('game_table_board').style.display = 'none';
    var handLoop = data.hand;
    for (let i = 0; i < handLoop; i++) {
        requestCard()
    }
}
//When opponent's hand updates
function updatePlayerCards(data) {
    console.log(data)
    var opponent_hand = document.getElementById(data.id).getElementsByClassName('opponent_hand')[0];
    opponent_hand.innerHTML = "";
    var cardn = data.cardn
    for(var i = 0; i < cardn ; i++){
        if(i == cardn-1){
            var cut_back = document.createElement("img");
            cut_back.src = `/static/uno/specials/back.png`;
            opponent_hand.appendChild(cut_back);
        } else {
            var cut_back = document.createElement("img");
            cut_back.src = `/static/uno/specials/cut_back.png`;
            opponent_hand.appendChild(cut_back);
        }
    }
}