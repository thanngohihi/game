document.addEventListener('DOMContentLoaded', () => {
  const boardSize = 5;
  const boardEl = document.getElementById('caroBoard');
  const overlay = document.getElementById('overlay');
  const roomInput = document.getElementById('roomInput');
  const joinRoomBtn = document.getElementById('joinRoomBtn');
  const createRoomBtn = document.getElementById('createRoomBtn');
  const roomCodeDisplay = document.getElementById('roomCodeDisplay');
  const currentPlayerDisplay = document.getElementById('currentPlayerDisplay');
  const playerNameDisplay = document.getElementById('playerNameDisplay');
  const resetGameBtn = document.getElementById('resetGameBtn');
  const backHomeBtn = document.getElementById('backHomeBtn');
  const modal = document.getElementById('caroModal');
  const winnerText = document.getElementById('winnerText');
  const modalRestart = document.getElementById('modalRestart');
  const errorText = document.getElementById('errorText');

  const scorePlayer1El = document.getElementById('scorePlayer1');
  const scorePlayer2El = document.getElementById('scorePlayer2');
  const player1NameEl = document.getElementById('player1Name');
  const player2NameEl = document.getElementById('player2Name');

  let roomCode = null, player1 = null, player2 = null;
  let cells = [], currentPlayer = null, gameOver = false;
  let scores = { player1: 0, player2: 0 };

  // Lấy tên người dùng đăng nhập từ trang chính
  const localUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Player' };

  function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  }

  function createBoard() {
    boardEl.innerHTML = '';
    cells = [];
    gameOver = false;

    const savedBoard = getRoomData()?.cells;

    for (let i = 0; i < boardSize * boardSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      cell.textContent = savedBoard?.[i] || '';
      cell.addEventListener('click', handleClick);
      boardEl.appendChild(cell);
      cells.push(cell);
    }

    updateDisplay();
    updateBoardLock();
  }

  function handleClick(e) {
    if (gameOver || !player1 || !player2 || !isUserTurn()) return;
    const cell = e.target;
    if (cell.textContent) return;

    cell.textContent = currentPlayer;
    saveBoard();

    if (checkWin(currentPlayer)) {
      gameOver = true;
      if (currentPlayer === 'X') scores.player1++;
      else scores.player2++;
      updateScores();
      showModal(`${currentPlayer === 'X' ? player1.username : player2.username} thắng!`);
      saveRoomData();
      return;
    }

    if (cells.every(c => c.textContent)) {
      gameOver = true;
      showModal('Hòa!');
      saveRoomData();
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    saveRoomData();
    updateDisplay();
    updateBoardLock();
  }

  function checkWin(p) {
    const lines = [];

    // Hàng ngang
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c <= boardSize - 4; c++) {
        lines.push([
          cells[r * boardSize + c],
          cells[r * boardSize + c + 1],
          cells[r * boardSize + c + 2],
          cells[r * boardSize + c + 3]
        ]);
      }
    }

    // Cột dọc
    for (let c = 0; c < boardSize; c++) {
      for (let r = 0; r <= boardSize - 4; r++) {
        lines.push([
          cells[r * boardSize + c],
          cells[(r + 1) * boardSize + c],
          cells[(r + 2) * boardSize + c],
          cells[(r + 3) * boardSize + c]
        ]);
      }
    }

    // Chéo chính (\)
    for (let r = 0; r <= boardSize - 4; r++) {
      for (let c = 0; c <= boardSize - 4; c++) {
        lines.push([
          cells[r * boardSize + c],
          cells[(r + 1) * boardSize + c + 1],
          cells[(r + 2) * boardSize + c + 2],
          cells[(r + 3) * boardSize + c + 3]
        ]);
      }
    }

    // Chéo phụ (/)
    for (let r = 3; r < boardSize; r++) {
      for (let c = 0; c <= boardSize - 4; c++) {
        lines.push([
          cells[r * boardSize + c],
          cells[(r - 1) * boardSize + c + 1],
          cells[(r - 2) * boardSize + c + 2],
          cells[(r - 3) * boardSize + c + 3]
        ]);
      }
    }

    return lines.some(line => line.every(cell => cell.textContent === p));
  }

  function updateDisplay() {
    playerNameDisplay.textContent = `${player1?.username || '---'} vs ${player2?.username || '---'}`;
    currentPlayerDisplay.textContent = currentPlayer
      ? (currentPlayer === 'X' ? player1.username : player2.username) + ' (' + currentPlayer + ')'
      : 'Chờ người chơi thứ 2';
    updateScores();
  }

  function updateScores() {
    player1NameEl.textContent = player1?.username || '---';
    player2NameEl.textContent = player2?.username || '---';
    scorePlayer1El.textContent = scores.player1;
    scorePlayer2El.textContent = scores.player2;
  }

  function updateBoardLock() {
    cells.forEach(c => {
      if (gameOver) { c.classList.remove('disabled'); return; }
      if (!player1 || !player2) c.classList.add('disabled');
      else if (isUserTurn()) c.classList.remove('disabled');
      else c.classList.add('disabled');
    });
  }

  function isUserTurn() {
    if (!currentPlayer) return false;
    return (currentPlayer === 'X' && localUser.username === player1.username) ||
           (currentPlayer === 'O' && localUser.username === player2.username);
  }

  function showModal(text) {
    winnerText.textContent = text;
    modal.classList.remove('hidden');
  }

  function saveRoomData() {
    if (!roomCode) return;
    const data = { player1, player2, currentPlayer, cells: cells.map(c => c.textContent), scores };
    localStorage.setItem('caro_' + roomCode, JSON.stringify(data));
  }

  function getRoomData() {
    return roomCode ? JSON.parse(localStorage.getItem('caro_' + roomCode)) : null;
  }

  function saveBoard() { if (roomCode) saveRoomData(); }

  createRoomBtn.addEventListener('click', () => {
    roomCode = generateRoomCode();
    player1 = localUser;
    player2 = null;
    scores = { player1: 0, player2: 0 };
    roomCodeDisplay.textContent = roomCode;
    overlay.classList.add('hidden');
    gameSection.classList.remove('hidden');
    currentPlayer = 'X';
    saveRoomData();
    createBoard();
  });

  joinRoomBtn.addEventListener('click', () => {
    const input = roomInput.value.trim().toUpperCase();
    if (!input) { errorText.textContent = 'Vui lòng nhập mã phòng'; errorText.classList.remove('hidden'); return; }

    const data = JSON.parse(localStorage.getItem('caro_' + input));
    if (!data) { errorText.textContent = 'Phòng không tồn tại'; errorText.classList.remove('hidden'); return; }

    roomCode = input;
    player1 = data.player1;
    player2 = localUser;
    currentPlayer = data.currentPlayer || 'X';
    scores = data.scores || { player1: 0, player2: 0 };
    saveRoomData();
    roomCodeDisplay.textContent = roomCode;
    overlay.classList.add('hidden');
    gameSection.classList.remove('hidden');
    createBoard();
  });

  backHomeBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});


  resetGameBtn.addEventListener('click', () => {
    cells.forEach(c => c.textContent = '');
    currentPlayer = 'X';
    gameOver = false;
    saveRoomData();
    updateDisplay();
    updateBoardLock();
  });

  modalRestart.addEventListener('click', () => {
    modal.classList.add('hidden');
    cells.forEach(c => c.textContent = '');
    currentPlayer = 'X';
    gameOver = false;
    saveRoomData();
    updateDisplay();
    updateBoardLock();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'caro_' + roomCode) {
      const data = JSON.parse(e.newValue);
      if (!data) return;
      player1 = data.player1;
      player2 = data.player2;
      currentPlayer = data.currentPlayer;
      scores = data.scores || { player1: 0, player2: 0 };
      cells.forEach((c, i) => c.textContent = data.cells[i]);
      updateDisplay();
      updateBoardLock();
    }
  });
});
