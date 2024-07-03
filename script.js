// script.js
let score = 0;
let clicksLeft = 2000;

function tapCircle(event) {
    event.preventDefault();
    const touches = event.changedTouches ? event.changedTouches : [event];
    
    if (clicksLeft > 0) {
        for (let i = 0; i < touches.length; i++) {
            if (clicksLeft > 0) {
                score++;
                clicksLeft--;
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
    scoreElement.style.color = 'red';
    scoreElement.style.fontSize = '24px';
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

setInterval(() => {
    if (clicksLeft < 2000) {
        clicksLeft++;
        document.getElementById('clicks').innerText = clicksLeft;
    }
}, 2000);
