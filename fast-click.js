document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const timerDisplay = document.getElementById('timerDisplay');
    const clickArea = document.getElementById('clickArea');
    const backHomeBtn = document.getElementById('backHomeBtn');
    const playerNameDisplay = document.getElementById('playerNameDisplay');
    const topScoresList = document.getElementById('topScores');

    const fcModal = document.getElementById('fcModal');
    const fcResultText = document.getElementById('fcResultText');
    const fcRestart = document.getElementById('fcRestart');

    const localUser = JSON.parse(localStorage.getItem('currentUser')) || {username:'Người chơi'};
    playerNameDisplay.textContent = localUser.username;

    let score = 0;
    let time = 60;
    let interval = null;
    let circleTimeout = null;

    function updateLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('fastClickTop')) || [];
        topScoresList.innerHTML = '';
        scores.slice(0,10).forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name}: ${item.score}`;
            topScoresList.appendChild(li);
        });
    }

    function spawnCircle() {
        clickArea.innerHTML = '';
        const circle = document.createElement('div');
        circle.classList.add('circle');

        const maxX = clickArea.clientWidth - 60;
        const maxY = clickArea.clientHeight - 60;
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        circle.style.left = x + 'px';
        circle.style.top = y + 'px';

        circle.addEventListener('click', () => {
            score++;
            scoreDisplay.textContent = score;
            spawnCircle();
        });

        clickArea.appendChild(circle);
    }

    function startGame() {
        score = 0;
        time = 60;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = time;
        clickArea.innerHTML = '';

        if (interval) clearInterval(interval);
        if (circleTimeout) clearTimeout(circleTimeout);

        spawnCircle();

        interval = setInterval(() => {
            time--;
            timerDisplay.textContent = time;
            if (time <= 0) endGame();
        }, 1000);
    }

    function endGame() {
        clearInterval(interval);
        clickArea.innerHTML = '';
        fcResultText.textContent = `Thời gian kết thúc! Điểm của bạn: ${score}`;
        fcModal.classList.remove('hidden');

        // Cập nhật top scores
        const scores = JSON.parse(localStorage.getItem('fastClickTop')) || [];
        scores.push({name: localUser.username, score});
        scores.sort((a,b) => b.score - a.score);
        localStorage.setItem('fastClickTop', JSON.stringify(scores));
        updateLeaderboard();
    }

    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', startGame);

    fcRestart.addEventListener('click', () => {
        fcModal.classList.add('hidden');
        startGame();
    });

    backHomeBtn.addEventListener('click', () => window.location.href='index.html');

    updateLeaderboard();
});
