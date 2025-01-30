const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const SPRITE_WIDTH = 211;
const SPRITE_HEIGHT = 206;
const PLAYER_SPEED = 5;
const FRAME_DURATION = 100; // Продолжительность кадра в миллисекундах

class Player {
    constructor(image) {
        this.image = image;
        this.x = 0;
        this.y = canvas.height - SPRITE_HEIGHT;
        this.width = SPRITE_WIDTH;
        this.height = SPRITE_HEIGHT;
        this.frameX = 0;
        this.frameY = 0;
        this.speed = PLAYER_SPEED;
        this.movingDirection = null; // 'right' или 'left'
        
        this.states = {
            standing: { frames: 6, frameY: 0 },
            movingRight: { frames: 7, frameY: 0 },
            movingLeft: { frames: 7, frameY: 0 }
        };
        
        this.currentState = this.states.standing;
        this.lastFrameTime = 0;
    }
    
    update(deltaTime) {
        if (this.movingDirection) {
            this.currentState = this.states[`moving${this.capitalize(this.movingDirection)}`];
            // Обновление позиции
            if (this.movingDirection === 'right') {
                this.x = Math.min(this.x + this.speed, canvas.width - this.width);
            } else if (this.movingDirection === 'left') {
                this.x = Math.max(this.x - this.speed, 0);
            }
            
            // Обновление кадра на основе времени
            this.lastFrameTime += deltaTime;
            if (this.lastFrameTime >= FRAME_DURATION) {
                this.frameX = (this.frameX + 1) % this.currentState.frames;
                this.lastFrameTime = 0;
            }
        } else {
            this.currentState = this.states.standing;
            // Возврат к первым кадрам стояния
            this.frameX = (this.frameX + 1) % this.currentState.frames;
        }
    }
    
    draw() {
        const sourceX = this.frameX * this.width;
        const sourceY = this.currentState.frameY * this.height;
        ctx.drawImage(
            this.image,
            sourceX,
            sourceY,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
    
    setDirection(direction) {
        this.movingDirection = direction;
    }
    
    clearDirection(direction) {
        if (this.movingDirection === direction) {
            this.movingDirection = null;
        }
    }
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

const playerImage = new Image();
playerImage.src = './content/player.png'; // Укажите путь к вашему изображению со спрайтами

const player = new Player(playerImage);

const keysPressed = new Set();

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') {
        keysPressed.add('right');
        player.setDirection('right');
    } else if (e.code === 'ArrowLeft') {
        keysPressed.add('left');
        player.setDirection('left');
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') {
        keysPressed.delete('right');
        player.clearDirection('right');
        if (keysPressed.has('left')) {
            player.setDirection('left');
        }
    } else if (e.code === 'ArrowLeft') {
        keysPressed.delete('left');
        player.clearDirection('left');
        if (keysPressed.has('right')) {
            player.setDirection('right');
        }
    }
});

let lastTime = performance.now();

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.update(deltaTime);
    player.draw();
    
    requestAnimationFrame(gameLoop);
}

playerImage.onload = function() {
    requestAnimationFrame(gameLoop);
};