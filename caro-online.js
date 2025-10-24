document.addEventListener('DOMContentLoaded',()=>{
  const boardSize = 5;
  const boardEl = document.getElementById('caroBoard');
  const gameSection = document.getElementById('gameSection');
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

  let cells = [];
  let currentPlayer = 'X';
  let gameOver = false;
  let roomCode = null;
  let player1 = null;
  let player2 = null;
  let localUser = JSON.parse(localStorage.getItem('currentUser')) || {username:'Người chơi'};

  function generateRoomCode(){ return Math.random().toString(36).substring(2,7).toUpperCase(); }

  function createBoard(){
      boardEl.innerHTML = '';
      cells = [];
      gameOver = false;
      for(let i=0;i<boardSize*boardSize;i++){
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.dataset.index = i;
          cell.addEventListener('click', handleClick);
          boardEl.appendChild(cell);
          cells.push(cell);
      }
      currentPlayer='X';
      updateDisplay();
      updateBoardLock();
  }

  function handleClick(e){
      if(gameOver) return;
      const cell = e.target;
      if(cell.textContent) return;
      if(!isUserTurn()) return;

      cell.textContent = currentPlayer;

      if(checkWin(currentPlayer)){
          showModal(`${currentPlayer} thắng!`);
          gameOver = true;
          return;
      }
      if(cells.every(c=>c.textContent)){
          showModal('Hòa!');
          gameOver = true;
          return;
      }

      currentPlayer = currentPlayer==='X'?'O':'X';
      updateDisplay();
      updateBoardLock();
  }

  function checkWin(p){
      const lines=[];
      // Hàng
      for(let r=0;r<boardSize;r++) lines.push(cells.slice(r*boardSize,r*boardSize+boardSize));
      // Cột
      for(let c=0;c<boardSize;c++) lines.push(Array.from({length:boardSize},(_,i)=>cells[i*boardSize+c]));
      // Chéo 3 ô liên tiếp
      for(let r=0;r<=boardSize-3;r++){
          for(let c=0;c<=boardSize-3;c++){
              lines.push([cells[r*boardSize+c], cells[(r+1)*boardSize+c+1], cells[(r+2)*boardSize+c+2]]);
          }
      }
      for(let r=2;r<boardSize;r++){
          for(let c=0;c<=boardSize-3;c++){
              lines.push([cells[r*boardSize+c], cells[(r-1)*boardSize+c+1], cells[(r-2)*boardSize+c+2]]);
          }
      }

      return lines.some(line=>line.every(cell=>cell.textContent===p));
  }

  function updateDisplay(){
      currentPlayerDisplay.textContent = currentPlayer;
      if(player1 && player2)
          playerNameDisplay.textContent = (currentPlayer==='X'?player1.username:player2.username);
  }

  function isUserTurn(){
      return (currentPlayer==='X' && localUser.username===player1.username) ||
             (currentPlayer==='O' && localUser.username===player2.username);
  }

  function updateBoardLock(){
      cells.forEach(c=>{
          if(gameOver){ c.classList.remove('disabled'); return; }
          if(isUserTurn()){ c.classList.remove('disabled'); }
          else { c.classList.add('disabled'); }
      });
  }

  function showModal(text){
      winnerText.textContent = text;
      modal.classList.remove('hidden');
  }

  // Tạo phòng
  createRoomBtn.addEventListener('click', ()=>{
      roomCode = generateRoomCode();
      player1 = localUser;
      player2 = {username:'Người chơi 2'};
      roomCodeDisplay.textContent = roomCode;
      document.querySelector('.overlay').classList.add('hidden');
      gameSection.classList.remove('hidden');
      createBoard();
  });

  // Tham gia phòng
  joinRoomBtn.addEventListener('click', ()=>{
      const input = roomInput.value.trim().toUpperCase();
      if(!input){ alert('Vui lòng nhập mã phòng'); return; }
      roomCode = input;
      player2 = localUser;
      if(!player1) player1 = {username:'Người chơi 1'};
      roomCodeDisplay.textContent = roomCode;
      document.querySelector('.overlay').classList.add('hidden');
      gameSection.classList.remove('hidden');
      createBoard();
  });

  // Nút về trang chính (giống Memory)
  backHomeBtn.addEventListener('click', ()=>{
      window.location.href='main.html';
  });

  // Reset / modal restart
  resetGameBtn.addEventListener('click', createBoard);
  modalRestart.addEventListener('click', ()=>{
      modal.classList.add('hidden');
      createBoard();
  });

});
