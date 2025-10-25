document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 5;
    const boardEl = document.getElementById('caroBoard');
    const gameSection = document.getElementById('gameSection');
    const overlay = document.querySelector('.overlay');
    const roomSection = document.getElementById('roomSection');
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
    const firstTurnModal = document.getElementById('firstTurnModal');
    const firstTurnText = document.getElementById('firstTurnText');
    const firstTurnOk = document.getElementById('firstTurnOk');
    const errorMsg = document.getElementById('errorMsg');

    let cells = [], currentPlayer = null, gameOver = false;
    let roomCode = null, player1 = null, player2 = null;
    const localUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Người chơi' };

    function generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i=0;i<5;i++) code += chars.charAt(Math.floor(Math.random()*chars.length));
        return code;
    }

    function showError(msg){
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
        setTimeout(()=> errorMsg.classList.add('hidden'), 3000);
    }

    function createBoard() {
        boardEl.innerHTML=''; cells=[]; gameOver=false;
        for (let i=0;i<boardSize*boardSize;i++){
            const cell=document.createElement('div');
            cell.classList.add('cell'); cell.dataset.index=i;
            cell.addEventListener('click', handleClick);
            boardEl.appendChild(cell);
            cells.push(cell);
        }
        updateDisplay(); updateBoardLock();
    }

    function handleClick(e){
        if(gameOver || !player1 || !player2 || !isUserTurn()) return;
        const cell=e.target;
        if(cell.textContent) return;
        cell.textContent=currentPlayer;
        if(checkWin(currentPlayer)){
            showModal(`${currentPlayer} thắng!`); gameOver=true; return;
        }
        if(cells.every(c=>c.textContent)){
            showModal('Hòa!'); gameOver=true; return;
        }
        currentPlayer = currentPlayer==='X'?'O':'X';
        updateDisplay(); updateBoardLock();
    }

    function checkWin(p){
        const lines=[];
        for(let r=0;r<boardSize;r++)
            for(let c=0;c<=boardSize-3;c++)
                lines.push([cells[r*boardSize+c],cells[r*boardSize+c+1],cells[r*boardSize+c+2]]);
        for(let c=0;c<boardSize;c++)
            for(let r=0;r<=boardSize-3;r++)
                lines.push([cells[r*boardSize+c],cells[(r+1)*boardSize+c],cells[(r+2)*boardSize+c]]);
        for(let r=0;r<=boardSize-3;r++)
            for(let c=0;c<=boardSize-3;c++)
                lines.push([cells[r*boardSize+c],cells[(r+1)*boardSize+c+1],cells[(r+2)*boardSize+c+2]]);
        for(let r=2;r<boardSize;r++)
            for(let c=0;c<=boardSize-3;c++)
                lines.push([cells[r*boardSize+c],cells[(r-1)*boardSize+c+1],cells[(r-2)*boardSize+c+2]]);
        return lines.some(line=>line.every(cell=>cell.textContent===p));
    }

    function updateDisplay(){
        playerNameDisplay.textContent = player1?player1.username:'---';
        if(player2) playerNameDisplay.textContent+=' vs '+player2.username;
        currentPlayerDisplay.textContent = currentPlayer?
            (currentPlayer==='X'?player1.username:player2.username)+' ('+currentPlayer+')'
            :'Chờ người chơi thứ 2';
    }

    function updateBoardLock(){
        cells.forEach(c=>{
            if(gameOver){ c.classList.remove('disabled'); return; }
            if(!player1 || !player2) c.classList.add('disabled');
            else if(isUserTurn()) c.classList.remove('disabled');
            else c.classList.add('disabled');
        });
    }

    function isUserTurn(){
        if(!currentPlayer) return false;
        return (currentPlayer==='X' && localUser.username===player1.username) ||
               (currentPlayer==='O' && localUser.username===player2.username);
    }

    function showModal(text){ winnerText.textContent=text; modal.classList.remove('hidden'); }

    createRoomBtn.addEventListener('click', ()=>{
        roomCode=generateRoomCode();
        player1=localUser; player2=null;
        roomCodeDisplay.textContent=roomCode;
        overlay.classList.add('hidden'); roomSection.classList.add('hidden'); gameSection.classList.remove('hidden');
        joinRoomBtn.style.display='none';
        currentPlayer=null; createBoard();
    });

    joinRoomBtn.addEventListener('click', ()=>{
        const input = roomInput.value.trim().toUpperCase();
        if(!input){ showError('Vui lòng nhập mã phòng'); return; }
        if(!roomCode || input!==roomCode){ showError('Mã phòng không hợp lệ hoặc chưa được tạo!'); return; }
        player2=localUser;
        currentPlayer = Math.random()<0.5?'X':'O';
        roomCodeDisplay.textContent=roomCode;
        overlay.classList.add('hidden'); roomSection.classList.add('hidden'); gameSection.classList.remove('hidden');
        joinRoomBtn.style.display='none';
        createBoard();
        firstTurnText.textContent=`${currentPlayer==='X'?player1.username:player2.username} sẽ đi trước!`;
        firstTurnModal.classList.remove('hidden');
    });

    firstTurnOk.addEventListener('click', ()=>{ firstTurnModal.classList.add('hidden'); updateDisplay(); updateBoardLock(); });
    backHomeBtn.addEventListener('click', ()=> window.location.href='index.html');
    resetGameBtn.addEventListener('click', createBoard);
    modalRestart.addEventListener('click', ()=>{ modal.classList.add('hidden'); createBoard(); });
});
