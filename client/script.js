// Kết nối Socket.IO
const socket = io('http://localhost:3000');

let currentUser = '';

// Login function
function login() {
    const username = document.getElementById('usernameInput').value.trim();
    
    if (username === '') {
        alert('Vui lòng nhập tên!');
        return;
    }
    
    currentUser = username;
    
    // Ẩn login, hiện chat
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'flex';
    
    // Thông báo server user mới join
    socket.emit('user-join', username);
}

// Gửi tin nhắn
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message === '') return;
    
    socket.emit('send-message', {
        username: currentUser,
        message: message
    });
    
    messageInput.value = '';
}

// Nhận tin nhắn
socket.on('receive-message', (data) => {
    const messagesContainer = document.getElementById('messagesContainer');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-username">${data.username}</span>
            <span class="message-time">${data.time}</span>
        </div>
        <div class="message-text">${data.message}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Update danh sách users online
socket.on('update-users', (users) => {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.username;
        usersList.appendChild(li);
    });
});

// Thông báo khi có user mới join
socket.on('user-joined', (username) => {
    const messagesContainer = document.getElementById('messagesContainer');
    
    const systemMsg = document.createElement('div');
    systemMsg.className = 'system-message';
    systemMsg.textContent = `${username} đã tham gia phòng chat`;
    
    messagesContainer.appendChild(systemMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Enter để gửi tin nhắn
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    document.getElementById('usernameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            login();
        }
    });
});