const board = document.getElementById('caroBoard');
const resetBtn = document.getElementById('resetGameBtn');
const modal = document.getElementById('caroModal');
const winnerText = document.getElementById('winnerText');
const modalRestart = document.getElementById('modalRestart');
const currentPlayerDisplay = document.getElementById('currentPlayerDisplay');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');

let boardSize = 5;
let cells = [];
let currentPlayer = 'X';
let gameOver = false;

// Tạo bàn cờ
function createBoard() {
  board.innerHTML = '';
  cells = [];
  for(let i=0;i<boardSize*boardSize;i++){
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
    cells.push(cell);
  }
  currentPlayerDisplay.textContent = currentPlayer;
}

// Xử lý click
function handleClick(e){
  if(gameOver) return;
  const cell = e.target;
  if(cell.textContent) return;
  cell.textContent = currentPlayer;
  
  if(checkWin(currentPlayer)){
    showModal(`${currentPlayer} thắng!`);
    gameOver = true;
    return;
  }

  if(cells.every(c => c.textContent)){
    showModal("Hòa!");
    gameOver = true;
    return;
  }

  // Chuyển lượt
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  currentPlayerDisplay.textContent = currentPlayer;
}

// Kiểm tra thắng
function checkWin(p){
  // Hàng
  for(let r=0; r<boardSize; r++){
    let win = true;
    for(let c=0; c<boardSize; c++){
      if(cells[r*boardSize + c].textContent !== p) {
        win = false;
        break;
      }
    }
    if(win) return true;
  }

  // Cột
  for(let c=0; c<boardSize; c++){
    let win = true;
    for(let r=0; r<boardSize; r++){
      if(cells[r*boardSize + c].textContent !== p) {
        win = false;
        break;
      }
    }
    if(win) return true;
  }

  // Đường chéo chính (\)
  let win = true;
  for(let i=0; i<boardSize; i++){
    if(cells[i*boardSize + i].textContent !== p){
      win = false;
      break;
    }
  }
  if(win) return true;

  // Đường chéo phụ (/)
  win = true;
  for(let i=0; i<boardSize; i++){
    if(cells[i*boardSize + (boardSize-1-i)].textContent !== p){
      win = false;
      break;
    }
  }
  if(win) return true;

  return false;
}

// Hiện modal
function showModal(text){
  winnerText.textContent = text;
  modal.classList.remove('hidden');
}

// Event listeners
modalRestart.addEventListener('click', ()=>{
  modal.classList.add('hidden');
  resetGame();
});
resetBtn.addEventListener('click', resetGame);

// Reset game
function resetGame(){
  currentPlayer = 'X';
  gameOver = false;
  createBoard();
}

// Khởi tạo
createBoard();
// Giả sử player là 'X' hoặc 'O'
function updateScore(player) {
  if(player === 'X') {
    let scoreEl = document.getElementById("scorePlayer1");
    scoreEl.textContent = parseInt(scoreEl.textContent) + 1;
  } else {
    let scoreEl = document.getElementById("scorePlayer2");
    scoreEl.textContent = parseInt(scoreEl.textContent) + 1;
  }
}

// Khi game kết thúc gọi:
updateScore(winner); // winner là 'X' hoặc 'O'
