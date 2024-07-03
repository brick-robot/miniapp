let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let clicksLeft = localStorage.getItem('clicksLeft') ? parseInt(localStorage.getItem('clicksLeft')) : 2000;
let farmStartTime = localStorage.getItem('farmStartTime') ? parseInt(localStorage.getItem('farmStartTime')) : null;
let coinsEarned = localStorage.getItem('coinsEarned') ? parseFloat(localStorage.getItem('coinsEarned')) : 0;

document.getElementById('score').innerText = score;
document.getElementById('clicks').innerText = clicksLeft;

function tapCircle(event) {
    event.preventDefault();
    const touches = event.changedTouches ? event.changedTouches : [event];
    
    if (clicksLeft > 0) {
        for (let i = 0; i < touches.length; i++) {
            if (clicksLeft > 0) {
                score++;
                clicksLeft--;
                localStorage.setItem('score', score);
                localStorage.setItem('clicksLeft', clicksLeft);
                document.getElementById('score').innerText = score;
                document.getElementById('clicks').innerText = clicksLeft;
                createFloatingScore(touches[i].clientX, touches[i].clientY);
            }
        }
        shakeCircle();
    }
}

function createFloatingScore(x, y) {
    const scoreElement = document.createElement('div');
    scoreElement.innerText = '+1';
    scoreElement.style.position = 'absolute';
    scoreElement.style.left = `${x}px`;
    scoreElement.style.top = `${y}px`;
    scoreElement.style.color = 'white';
    scoreElement.style.fontSize = '30px';
    scoreElement.style.fontWeight = 'bold';
    document.body.appendChild(scoreElement);

    gsap.to(scoreElement, { 
        y: -50, 
        opacity: 0, 
        duration: 1, 
        onComplete: () => scoreElement.remove() 
    });
}

function shakeCircle() {
    const circle = document.getElementById('circle');
    gsap.fromTo(circle, 
        { x: -5 }, 
        { x: 5, duration: 0.1, repeat: 5, yoyo: true }
    );
}

// افزایش تعداد کلیک هر 3 ثانیه
setInterval(() => {
    if (clicksLeft < 2000) {
        clicksLeft++;
        localStorage.setItem('clicksLeft', clicksLeft);
        document.getElementById('clicks').innerText = clicksLeft;
    }
}, 3000);

function navigateTo(page) {
    const activePage = document.querySelector('.page.active');
    const targetPage = document.getElementById(page);

    if (activePage !== targetPage) {
        gsap.to(activePage, { 
            x: '-100%', 
            opacity: 0, 
            duration: 0.5, 
            onComplete: () => {
                activePage.classList.remove('active');
                targetPage.style.x = '100%';
                targetPage.style.opacity = 0;
                targetPage.classList.add('active');
                gsap.to(targetPage, { x: '0%', opacity: 1, duration: 0.5 });
                if (page === 'farm') {
                    checkFarmStatus();
                }
            }
        });
    }
}

function startFarm() {
    farmStartTime = Date.now();
    localStorage.setItem('farmStartTime', farmStartTime);
    document.getElementById('start-farm').style.display = 'none';
    document.getElementById('farm-info').style.display = 'block';
    updateFarmStatus();
    farmInterval = setInterval(updateFarmStatus, 1000); // شروع به‌روزرسانی وضعیت فارم
}

function updateFarmStatus() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - farmStartTime;
    const totalFarmTime = 3 * 60 * 60 * 1000; // سه ساعت
    const totalCoins = 300;

    if (elapsedTime >= totalFarmTime) {
        coinsEarned = totalCoins;
        clearInterval(farmInterval);
        document.getElementById('collect-coins').style.display = 'block';
        document.getElementById('time-left').style.display = 'none'; // محو شدن زمان
    } else {
        const coinsPerMs = totalCoins / totalFarmTime;
        coinsEarned = coinsPerMs * elapsedTime;
    }

    localStorage.setItem('coinsEarned', coinsEarned);
    document.getElementById('coins-earned').innerText = coinsEarned.toFixed(3);
    document.getElementById('time-left').innerText = formatTime(totalFarmTime - elapsedTime);
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
}

function collectCoins() {
    score += coinsEarned;
    localStorage.setItem('score', score);
    document.getElementById('score').innerText = score;
    farmStartTime = null;
    coinsEarned = 0;
    localStorage.removeItem('farmStartTime');
    localStorage.removeItem('coinsEarned');
    document.getElementById('farm-info').style.display = 'none';
    document.getElementById('start-farm').style.display = 'block';
    document.getElementById('collect-coins').style.display = 'none'; // محو شدن دکمه collect
    document.getElementById('time-left').style.display = 'block'; // نمایش زمان برای فارم بعدی
}

function checkFarmStatus() {
    if (farmStartTime) {
        document.getElementById('start-farm').style.display = 'none';
        document.getElementById('farm-info').style.display = 'block';
        updateFarmStatus();
        farmInterval = setInterval(updateFarmStatus, 1000);
    } else {
        document.getElementById('farm-info').style.display = 'none';
        document.getElementById('start-farm').style.display = 'block';
    }
}

let farmInterval;
if (farmStartTime) {
    checkFarmStatus();
}
