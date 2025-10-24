// main.js — load currentUser from localStorage, logout, card click
document.addEventListener('DOMContentLoaded', function () {
  // If no currentUser => redirect to login
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Display username
  const displayEl = document.getElementById('displayUsername');
  if (displayEl) displayEl.textContent = currentUser.username || currentUser.email || 'Player';

  // Logout handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem('currentUser');
      // keep users list intact
      // redirect to login
      window.location.href = 'login.html';
    });
  }

  // Game card click
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function () {
      // if coming-soon, show notification
      if (card.classList.contains('coming-soon')) {
        showToast('Tựa game này sắp ra mắt — chờ bản cập nhật!', 'info');
        return;
      }
      const target = card.getAttribute('data-game');
      if (target) {
        // navigate to the game page file (ensure file exists)
        window.location.href = target;
      } else {
        showToast('Không tìm thấy trang game.', 'error');
      }
    });
  });

  // Small toast function (reusable)
  function showToast(message, type = 'info') {
    // remove existing
    const prev = document.getElementById('__main_toast');
    if (prev) prev.remove();

    const t = document.createElement('div');
    t.id = '__main_toast';
    t.textContent = message;
    t.style.position = 'fixed';
    t.style.left = '50%';
    t.style.top = '20px';
    t.style.transform = 'translateX(-50%)';
    t.style.padding = '10px 16px';
    t.style.borderRadius = '10px';
    t.style.zIndex = 9999;
    t.style.fontWeight = '600';
    t.style.color = '#fff';
    t.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)';

    if (type === 'error') {
      t.style.background = 'linear-gradient(90deg,#ff4d6d,#ff2058)';
    } else if (type === 'success') {
      t.style.background = 'linear-gradient(90deg,#5ef3b8,#29d07b)';
      t.style.color = '#001';
    } else {
      t.style.background = 'linear-gradient(90deg,#ff58c6,#8c3bff)';
    }

    document.body.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .3s';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 350);
    }, 2200);
  }
});
