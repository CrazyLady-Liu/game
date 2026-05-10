const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const TILE_SIZE = 20;
const COLS = 28;
const ROWS = 31;
canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE;

const EMPTY = 0;
const WALL = 1;
const DOT = 2;
const POWER_DOT = 3;

let gameState = 'running';
let score = 0;
let powerMode = false;
let powerTimer = 0;
const POWER_DURATION = 500;

const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,3,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,1,3,1],
    [1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,2,1,1,1,1,1,1,2,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,1,2,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,1,1,2,1,1,0,0,1,1,2,1,1,1,1,2,1,1,1,1,1],
    [0,0,0,1,2,1,1,1,1,1,2,1,1,0,0,1,1,2,1,1,1,1,2,1,0,0,0,1],
    [0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,1],
    [0,0,0,1,2,1,0,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,2,1,0,0,0,1],
    [1,1,1,1,2,1,0,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,2,1,1,1,1,1],
    [0,0,0,0,2,0,0,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,2,0,0,0,0,1],
    [1,1,1,1,2,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,2,1,1,1,1,1],
    [0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,0,0,0,1],
    [0,0,0,1,2,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,2,1,0,0,0,1],
    [0,0,0,1,2,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,2,1,0,0,0,1],
    [1,1,1,1,2,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,1,2,1,1,2,1],
    [1,3,2,1,2,2,2,2,0,0,2,2,2,0,0,2,2,2,0,0,2,2,2,2,1,2,3,1],
    [1,1,2,1,2,1,2,1,1,1,2,1,1,1,1,1,1,2,1,1,2,1,2,1,2,1,1,1],
    [1,2,2,2,2,1,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,1,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,2,1,1,1,0,0,1,1,1,2,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,2,1,1,1,0,0,1,1,1,2,1,1,2,1,0,0,0,0,1],
    [0,0,0,0,0,1,2,2,2,2,0,0,0,0,0,0,0,0,2,2,2,2,1,0,0,0,0,1],
    [0,0,0,0,0,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,0,0,0,0,1],
    [1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const player = {
    x: 14,
    y: 23,
    direction: 'right',
    nextDirection: 'right',
    mouthOpen: true,
    mouthTimer: 0
};

const ghosts = [
    { x: 13, y: 14, color: '#ff0000', direction: 'up', scared: false },
    { x: 14, y: 14, color: '#ffb8ff', direction: 'down', scared: false },
    { x: 13, y: 13, color: '#00ffff', direction: 'left', scared: false },
    { x: 14, y: 13, color: '#ffb852', direction: 'right', scared: false }
];

let currentMap = [];
let remainingDots = 0;

function initGame() {
    currentMap = JSON.parse(JSON.stringify(map));
    remainingDots = 0;
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (currentMap[y][x] === DOT || currentMap[y][x] === POWER_DOT) {
                remainingDots++;
            }
        }
    }
    player.x = 14;
    player.y = 23;
    player.direction = 'right';
    player.nextDirection = 'right';
    player.mouthOpen = true;
    ghosts[0] = { x: 13, y: 14, color: '#ff0000', direction: 'up', scared: false };
    ghosts[1] = { x: 14, y: 14, color: '#ffb8ff', direction: 'down', scared: false };
    ghosts[2] = { x: 13, y: 13, color: '#00ffff', direction: 'left', scared: false };
    ghosts[3] = { x: 14, y: 13, color: '#ffb852', direction: 'right', scared: false };
    score = 0;
    powerMode = false;
    powerTimer = 0;
    gameState = 'running';
    statusElement.textContent = '';
    restartBtn.style.display = 'none';
    scoreElement.textContent = score;
}

function isWall(x, y) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
        return x < 0 || x >= COLS;
    }
    return currentMap[y][x] === WALL;
}

function moveEntity(entity, nextX, nextY) {
    if (!isWall(nextX, nextY)) {
        entity.x = nextX;
        entity.y = nextY;
        if (entity.x < 0) entity.x = COLS - 1;
        if (entity.x >= COLS) entity.x = 0;
        return true;
    }
    return false;
}

function getNextPosition(x, y, direction) {
    switch (direction) {
        case 'up': return { x, y: y - 1 };
        case 'down': return { x, y: y + 1 };
        case 'left': return { x: x - 1, y };
        case 'right': return { x: x + 1, y };
    }
    return { x, y };
}

function updatePlayer() {
    const next = getNextPosition(player.x, player.y, player.nextDirection);
    if (!isWall(next.x, next.y)) {
        player.direction = player.nextDirection;
    }
    const currentNext = getNextPosition(player.x, player.y, player.direction);
    moveEntity(player, currentNext.x, currentNext.y);
    player.mouthTimer++;
    if (player.mouthTimer > 10) {
        player.mouthOpen = !player.mouthOpen;
        player.mouthTimer = 0;
    }
    const tile = currentMap[player.y][player.x];
    if (tile === DOT) {
        currentMap[player.y][player.x] = EMPTY;
        score += 10;
        remainingDots--;
        scoreElement.textContent = score;
    } else if (tile === POWER_DOT) {
        currentMap[player.y][player.x] = EMPTY;
        score += 50;
        remainingDots--;
        powerMode = true;
        powerTimer = POWER_DURATION;
        ghosts.forEach(g => g.scared = true);
        scoreElement.textContent = score;
    }
    if (remainingDots === 0) {
        gameState = 'win';
        statusElement.textContent = '你赢了！';
        restartBtn.style.display = 'block';
    }
}

function updateGhosts() {
    if (powerMode) {
        powerTimer--;
        if (powerTimer <= 0) {
            powerMode = false;
            ghosts.forEach(g => g.scared = false);
        }
    }
    ghosts.forEach(ghost => {
        if (Math.random() < 0.3) {
            const directions = ['up', 'down', 'left', 'right'];
            ghost.direction = directions[Math.floor(Math.random() * 4)];
        }
        if (!ghost.scared) {
            const dx = player.x - ghost.x;
            const dy = player.y - ghost.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                ghost.direction = dx > 0 ? 'right' : 'left';
            } else {
                ghost.direction = dy > 0 ? 'down' : 'up';
            }
        } else {
            const dx = player.x - ghost.x;
            const dy = player.y - ghost.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                ghost.direction = dx > 0 ? 'left' : 'right';
            } else {
                ghost.direction = dy > 0 ? 'up' : 'down';
            }
        }
        const next = getNextPosition(ghost.x, ghost.y, ghost.direction);
        if (!moveEntity(ghost, next.x, next.y)) {
            const directions = ['up', 'down', 'left', 'right'];
            for (const dir of directions) {
                const altNext = getNextPosition(ghost.x, ghost.y, dir);
                if (moveEntity(ghost, altNext.x, altNext.y)) {
                    ghost.direction = dir;
                    break;
                }
            }
        }
    });
}

function checkCollisions() {
    ghosts.forEach((ghost, index) => {
        if (ghost.x === player.x && ghost.y === player.y) {
            if (ghost.scared) {
                score += 200;
                scoreElement.textContent = score;
                ghost.x = 13 + (index % 2);
                ghost.y = 14;
                ghost.scared = false;
            } else {
                gameState = 'lose';
                statusElement.textContent = '游戏结束！';
                restartBtn.style.display = 'block';
            }
        }
    });
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const tile = currentMap[y][x];
            const px = x * TILE_SIZE;
            const py = y * TILE_SIZE;
            if (tile === WALL) {
                ctx.fillStyle = '#0000ff';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            } else if (tile === DOT) {
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 3, 0, Math.PI * 2);
                ctx.fill();
            } else if (tile === POWER_DOT) {
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    const px = player.x * TILE_SIZE + TILE_SIZE / 2;
    const py = player.y * TILE_SIZE + TILE_SIZE / 2;
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    let startAngle = 0;
    let endAngle = Math.PI * 2;
    if (player.mouthOpen) {
        switch (player.direction) {
            case 'right': startAngle = 0.25; endAngle = 1.75; break;
            case 'left': startAngle = 1.25; endAngle = 0.75; break;
            case 'up': startAngle = 1.75; endAngle = 1.25; break;
            case 'down': startAngle = 0.75; endAngle = 0.25; break;
        }
        startAngle *= Math.PI;
        endAngle *= Math.PI;
    }
    ctx.arc(px, py, TILE_SIZE / 2 - 2, startAngle, endAngle);
    ctx.lineTo(px, py);
    ctx.fill();
    ghosts.forEach(ghost => {
        const gx = ghost.x * TILE_SIZE + TILE_SIZE / 2;
        const gy = ghost.y * TILE_SIZE + TILE_SIZE / 2;
        ctx.fillStyle = ghost.scared ? '#0000ff' : ghost.color;
        ctx.beginPath();
        ctx.arc(gx, gy, TILE_SIZE / 2 - 2, Math.PI, 0);
        ctx.lineTo(gx + TILE_SIZE / 2 - 2, gy + TILE_SIZE / 2 - 2);
        ctx.lineTo(gx + TILE_SIZE / 4 - 2, gy + TILE_SIZE / 3 - 2);
        ctx.lineTo(gx, gy + TILE_SIZE / 2 - 2);
        ctx.lineTo(gx - TILE_SIZE / 4 + 2, gy + TILE_SIZE / 3 - 2);
        ctx.lineTo(gx - TILE_SIZE / 2 + 2, gy + TILE_SIZE / 2 - 2);
        ctx.closePath();
        ctx.fill();
    });
}

function gameLoop() {
    if (gameState === 'running') {
        updatePlayer();
        updateGhosts();
        checkCollisions();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': player.nextDirection = 'up'; break;
        case 'ArrowDown': player.nextDirection = 'down'; break;
        case 'ArrowLeft': player.nextDirection = 'left'; break;
        case 'ArrowRight': player.nextDirection = 'right'; break;
    }
});

restartBtn.addEventListener('click', () => {
    initGame();
});

initGame();
gameLoop();
