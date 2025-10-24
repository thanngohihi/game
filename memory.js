document.addEventListener('DOMContentLoaded',()=>{
  const currentUser=JSON.parse(localStorage.getItem('currentUser')||'null');
  if(!currentUser){ window.location.href='login.html'; return;}
  document.getElementById('memUsername').textContent=currentUser.username||currentUser.email||'Player';

  const EMOJIS=['⭐','🌸','🧸','🍓','🐰','🍬','🦄','🎈'];

  const boardEl=document.getElementById('board');
  const timerEl=document.getElementById('timer');
  const movesEl=document.getElementById('moves');
  const restartBtn=document.getElementById('restartBtn');
  const backBtn=document.getElementById('backBtn');
  const winModal=document.getElementById('winModal');
  const finalTime=document.getElementById('finalTime');
  const finalMoves=document.getElementById('finalMoves');
  const playAgain=document.getElementById('playAgain');
  const toHome=document.getElementById('toHome');

  let deck=[],first=null,second=null,locked=false,matches=0,moves=0,started=false,seconds=0,timerInterval;

  function shuffle(array){return array.sort(()=>Math.random()-0.5);}
  function formatTime(s){let m=Math.floor(s/60),sec=s%60;return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;}
  function startTimer(){timerInterval=setInterval(()=>{seconds++;timerEl.textContent=formatTime(seconds);},1000);}
  function stopTimer(){clearInterval(timerInterval);}

  function buildDeck(){
    boardEl.innerHTML=''; first=second=null; locked=false; matches=0; moves=0; started=false; seconds=0; timerEl.textContent='00:00'; movesEl.textContent='0';
    let arr=[...EMOJIS,...EMOJIS]; deck=shuffle(arr).map(e=>({emoji:e,matched:false}));
    deck.forEach(card=>{
      const c=document.createElement('div'); c.className='card';
      const inner=document.createElement('div'); inner.className='card-inner';
      const front=document.createElement('div'); front.className='card-face card-front'; front.textContent=card.emoji;
      const back=document.createElement('div'); back.className='card-face card-back'; back.textContent='❔';
      inner.appendChild(front); inner.appendChild(back);
      c.appendChild(inner); 
      c.addEventListener('click',()=>flipCard(card,c));
      boardEl.appendChild(c); card.el=c;
    });
  }

  function flipCard(card,el){
    if(locked||card.matched||el.classList.contains('flipped')) return;
    el.classList.add('flipped');
    if(!started){started=true;startTimer();}
    if(!first){first=card;} else {second=card;locked=true;moves++; movesEl.textContent=moves; checkMatch();}
  }

  function checkMatch(){
    if(first.emoji===second.emoji){
      first.matched=second.matched=true;
      first.el.classList.add('matched'); second.el.classList.add('matched');
      matches++;
      resetTurn();
      if(matches===deck.length/2){gameWin();}
    } else {
      setTimeout(()=>{ first.el.classList.remove('flipped'); second.el.classList.remove('flipped'); resetTurn();},800);
    }
  }
  function resetTurn(){first=second=null; locked=false;}
  function gameWin(){
    stopTimer();
    finalTime.textContent=formatTime(seconds);
    finalMoves.textContent=moves;
    winModal.classList.remove('hidden');
  }

  restartBtn.addEventListener('click',()=>{buildDeck();});
  playAgain.addEventListener('click',()=>{winModal.classList.add('hidden'); buildDeck();});
  toHome.addEventListener('click',()=>{window.location.href='index.html';});
  backBtn.addEventListener('click',()=>{window.location.href='index.html';});

  buildDeck();
});
