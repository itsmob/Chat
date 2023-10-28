//io('http://domain:port') if you get a trouble starting the io connection, it might be coz it needs the domain
const socket = io();

//DOM elements
const message = document.getElementById('message');
const username = document.getElementById('username');
const btn = document.getElementById('send');
const output = document.getElementById('output');
const chatState = document.getElementById('chat-state');
const chatWindow = document.getElementById('chat-window');

//handle user types message in 2 parts (typing and not typing)
function updateUserTypingUI(users) {
  if (users.length == 0) {
    chatState.innerHTML = ``;
  } else if (users.length == 1) {
    chatState.innerHTML = `<p><em>${users[0]} is typing...</em></p>`;
  } else if (users.length > 1 && users.length < 4) {
    chatState.innerHTML = `<p><em>${users.join(', ')} are typing...</em></p>`;
  } else {
    chatState.innerHTML = `<p><em>several people are typing...</em></p>`;
  }
}
//part 1 when the user is typing or not longer typing (sending the event)
message.addEventListener('input', () => {
  const payload = {
    username: username.value,
  };
  message.value.length > 0 ? socket.emit('client:chat:typing', payload) : socket.emit('client:chat:nottyping', payload);
});
//part 2 when another user is typing or not longer typing (recieving the event)
const usersTyping = [];

socket.on('server:chat:typing', (payload) => {
  if (!usersTyping.includes(payload.username)) {
    usersTyping.push(payload.username);
    updateUserTypingUI(usersTyping);
  }
});

socket.on('server:chat:nottyping', (payload) => {
  const index = usersTyping.findIndex((user) => user == payload.username);
  usersTyping.splice(index, 1);

  updateUserTypingUI(usersTyping);
});

//handle user sends message in 2 parts (sending and receiving)
//part 1 when the user sends a msg
btn.addEventListener('click', () => {
  const payload = {
    username: username.value,
    message: message.value,
  };

  socket.emit('client:chat:message', payload);
  socket.emit('client:chat:nottyping', payload);
  message.value = '';
});

//part 2 when the user gets a msg
socket.on('server:chat:message', (payload) => {
  output.innerHTML += `<p><strong>${payload.username}</strong>: ${payload.message}</p>`;
  chatWindow.scrollTo(0, chatWindow.scrollHeight);
});
