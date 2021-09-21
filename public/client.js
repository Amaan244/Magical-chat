const socket = io();
var name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
var audio = new Audio('message.mp3');
var msg_area = document.querySelector('.message__area');

do {
    name = prompt('Enter your Beautiful Name to use Magical Chat')
} while (!name);
socket.emit('new-user-joined', name); 

/* ---------- Notifying that user has joined  ----------*/
socket.on('user-connected', (socket_name) => {
    userJoinLeft(socket_name, 'Joined');
    // console.log('hi');
});

socket.on('user-disconnected', (socket_name) => {
    userJoinLeft(socket_name, 'left')
});

/* ---------- function to create joined/left status div  ----------*/
function userJoinLeft(name, status) {
    let div = document.createElement("div");
    div.classList.add('user-join');
    let content = `<p><b>${name}</b> ${status} the chat</p>`
    div.innerHTML = content;
    msg_area.appendChild(div);
}


textarea.addEventListener('keyup', (e) =>{
    if(e.key === 'Enter'){
        sendMessage(e.target.value)
    }
})

function sendMessage(message){
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()
    // Send to server
    
    socket.emit('message', msg)

}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>

    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
    if (type == 'incoming') {
        audio.play();
        
    }
}

// Recieve message

socket.on('message', (msg) => {
    appendMessage(msg,'incoming')
    scrollToBottom()

})


function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight
}