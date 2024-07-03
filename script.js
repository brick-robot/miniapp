// script.js
let score = 0;

function tapCircle(event) {
    event.preventDefault();
    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        score++;
        document.getElementById('score').innerText = score;
        createFloatingScore(touches[i].clientX, touches[i].clientY);
    }

    shakeCircle();
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
