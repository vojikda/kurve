// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gameOverDiv = document.getElementById('gameOver');
    const restartBtn = document.getElementById('restartBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    // Debug: Check if buttons are found
    console.log('Left button found:', leftBtn);
    console.log('Right button found:', rightBtn);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const WORM_RADIUS = 4;
    const SPEED = 2.0;
    const TURN_ANGLE = Math.PI / 21.33;

    let gameRunning = true;
    let animationId;

    let worm = {
        x: WIDTH / 2,
        y: HEIGHT / 2,
        angle: 0,
        trail: []
    };

    function resetGame() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        worm = {
            x: WIDTH / 2,
            y: HEIGHT / 2,
            angle: 0,
            trail: []
        };
        gameRunning = true;
        gameOverDiv.style.display = 'none';
        restartBtn.style.display = 'none';
        loop();
    }

    function drawWorm() {
        ctx.beginPath();
        ctx.arc(worm.x, worm.y, WORM_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = '#0ff';
        ctx.fill();
    }

    function moveWorm() {
        worm.x += Math.cos(worm.angle) * SPEED;
        worm.y += Math.sin(worm.angle) * SPEED;
        worm.trail.push({ x: worm.x, y: worm.y });
    }

    function checkCollision() {
        // Border collision
        if (
            worm.x < WORM_RADIUS ||
            worm.x > WIDTH - WORM_RADIUS ||
            worm.y < WORM_RADIUS ||
            worm.y > HEIGHT - WORM_RADIUS
        ) {
            return true;
        }
        // Self collision
        for (let i = 0; i < worm.trail.length - 10; i++) { // skip last 10 to avoid instant collision
            let t = worm.trail[i];
            let dx = worm.x - t.x;
            let dy = worm.y - t.y;
            if (dx * dx + dy * dy < WORM_RADIUS * WORM_RADIUS * 1.5) {
                return true;
            }
        }
        return false;
    }

    function loop() {
        if (!gameRunning) return;
        moveWorm();
        if (checkCollision()) {
            gameOver();
            return;
        }
        drawWorm();
        animationId = requestAnimationFrame(loop);
    }

    function gameOver() {
        gameRunning = false;
        gameOverDiv.style.display = 'block';
        restartBtn.style.display = 'inline-block';
        cancelAnimationFrame(animationId);
    }

    function turnLeft() {
        console.log('Turn left called');
        if (gameRunning) {
            worm.angle -= TURN_ANGLE;
        }
    }

    function turnRight() {
        console.log('Turn right called');
        if (gameRunning) {
            worm.angle += TURN_ANGLE;
        }
    }

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            turnLeft();
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            turnRight();
        }
    });

    // Touch/Click Controls - Add error handling
    if (leftBtn) {
        leftBtn.addEventListener('click', (e) => {
            console.log('Left button clicked');
            e.preventDefault();
            turnLeft();
        });
        
        leftBtn.addEventListener('touchstart', (e) => {
            console.log('Left button touched');
            e.preventDefault();
            turnLeft();
        });
    } else {
        console.error('Left button not found!');
    }

    if (rightBtn) {
        rightBtn.addEventListener('click', (e) => {
            console.log('Right button clicked');
            e.preventDefault();
            turnRight();
        });
        
        rightBtn.addEventListener('touchstart', (e) => {
            console.log('Right button touched');
            e.preventDefault();
            turnRight();
        });
    } else {
        console.error('Right button not found!');
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', resetGame);
    } else {
        console.error('Restart button not found!');
    }

    // Start the game
    resetGame();
}); 