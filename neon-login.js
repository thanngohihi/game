// file: neon-login.js

// Lấy danh sách user từ localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Lưu users vào localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function showRegister() {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('registerBox').style.display = 'block';
}

function showLogin() {
    document.getElementById('registerBox').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
}

function showNotification(message, type='error') {
    let existing = document.getElementById('notification');
    if(existing) existing.remove();

    let notif = document.createElement('div');
    notif.id = 'notification';
    notif.innerText = message;
    notif.style.position = 'fixed';
    notif.style.top = '20px';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.padding = '12px 20px';
    notif.style.background = type === 'error' ? 'rgba(255,50,50,0.9)' : 'rgba(50,255,50,0.9)';
    notif.style.color = '#fff';
    notif.style.borderRadius = '8px';
    notif.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    notif.style.zIndex = 9999;
    notif.style.fontWeight = '500';
    notif.style.fontSize = '14px';

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// Đăng nhập
document.getElementById('loginForm').addEventListener('submit', function(e){
    e.preventDefault();
    let username = this.querySelector('input[type=text]').value;
    let password = this.querySelector('input[type=password]').value;

    const user = users.find(u => u.username === username && u.password === password);
    if(user) {
        // Lưu user đang đăng nhập
        localStorage.setItem('currentUser', JSON.stringify(user));

        showNotification('Đăng nhập thành công!', 'success');
        setTimeout(()=>{
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showNotification('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
    }
});

// Kiểm tra email
function isValidEmail(email) {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
}

// Đăng ký
document.getElementById('registerForm').addEventListener('submit', function(e){
    e.preventDefault();
    const usernameInput = this.querySelector('input[type=text]');
    const emailInput = this.querySelector('input[type=email]');
    const passwordInput = this.querySelectorAll('input[type=password]')[0];
    const confirmPasswordInput = this.querySelectorAll('input[type=password]')[1];

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if(!isValidEmail(email)) {
        showNotification('Email không hợp lệ!', 'error');
        return;
    }

    if(password !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }

    // Kiểm tra username trùng
    const existingUser = users.find(u => u.username === username);
    if(existingUser) {
        showNotification('Tên đăng nhập đã tồn tại!', 'error');
        return;
    }

    // Lưu user vào array và localStorage
    users.push({username: username, email: email, password: password});
    saveUsers();

    showNotification('Đăng ký thành công! Quay về đăng nhập.', 'success');

    // Reset form
    usernameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    document.getElementById('loginForm').querySelector('input[type=text]').value = '';
    document.getElementById('loginForm').querySelector('input[type=password]').value = '';

    showLogin();
});
