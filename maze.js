const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
const cols = 20;
const rows = 15;
canvas.width = cols * boxSize;
canvas.height = rows * boxSize;

let player, exit, level, walls, timer, timerInterval, gamePaused = false;

// ✅ Generate a random maze
function generateMaze() {
    let maze = [];
    for (let i = 0; i < 15; i++) {
        let x = Math.floor(Math.random() * cols) * boxSize;
        let y = Math.floor(Math.random() * rows) * boxSize;
        if ((x !== 0 || y !== 0) && (x !== canvas.width - boxSize || y !== canvas.height - boxSize)) {
            maze.push({ x, y });
        }
    }
    return maze;
}

// ✅ Start a new level
function startLevel(lvl) {
    level = lvl;
    document.getElementById("level").innerText = level + 1;
    document.getElementById("timer").innerText = "30";

    player = { x: 0, y: 0 };
    exit = { x: canvas.width - boxSize, y: canvas.height - boxSize };
    walls = generateMaze();

    clearInterval(timerInterval);
    timer = 30;
    timerInterval = setInterval(updateTimer, 1000);
    gamePaused = false;

    drawMaze();
}

// ✅ Draw the maze, player, and exit
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw walls
    ctx.fillStyle = "black";
    walls.forEach(wall => ctx.fillRect(wall.x, wall.y, boxSize, boxSize));

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, boxSize, boxSize);

    // Draw exit
    ctx.fillStyle = "green";
    ctx.fillRect(exit.x, exit.y, boxSize, boxSize);
}

// ✅ Check if move is valid
function isValidMove(x, y) {
    return !walls.some(wall => wall.x === x && wall.y === y) &&
           x >= 0 && y >= 0 && x < canvas.width && y < canvas.height;
}

// ✅ Move player function
function movePlayer(dx, dy) {
    if (gamePaused) return;

    let newX = player.x + dx;
    let newY = player.y + dy;

    if (isValidMove(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }

    if (player.x === exit.x && player.y === exit.y) {
        clearInterval(timerInterval);
        if (level < 4) {
            alert(`🎉 Level ${level + 1} Completed! Moving to Level ${level + 2}...`);
            startLevel(level + 1);
        } else {
            alert("🏆 You completed all levels! Congratulations!");
            startLevel(0);
        }
    }

    drawMaze();
}

// ✅ Timer function
function updateTimer() {
    if (gamePaused) return;

    timer--;
    document.getElementById("timer").innerText = `${timer} sec`;
    if (timer <= 0) {
        clearInterval(timerInterval);
        alert("⏳ Time's up! Restarting the game...");
        startLevel(0);
    }
}

// ✅ Arrow Key Controls (Laptop)
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") movePlayer(0, -boxSize);
    if (event.key === "ArrowDown") movePlayer(0, boxSize);
    if (event.key === "ArrowLeft") movePlayer(-boxSize, 0);
    if (event.key === "ArrowRight") movePlayer(boxSize, 0);
});

// ✅ Mobile Button Controls
document.getElementById("up").addEventListener("click", () => movePlayer(0, -boxSize));
document.getElementById("down").addEventListener("click", () => movePlayer(0, boxSize));
document.getElementById("left").addEventListener("click", () => movePlayer(-boxSize, 0));
document.getElementById("right").addEventListener("click", () => movePlayer(boxSize, 0));

// ✅ Restart and Stop Buttons
document.getElementById("restart").addEventListener("click", () => startLevel(0));
document.getElementById("stop").addEventListener("click", () => {
    gamePaused = true;
    clearInterval(timerInterval);
    alert("🛑 Game Stopped! Press Restart to Play Again.");
});

// ✅ Start the first level
startLevel(0);
document.getElementById("start").addEventListener("click", () => {
    startLevel(0);
});