let canvas = document.getElementById('canvas');
let world;
let keyboard = new Keyboard();

function init() {
    initLevel();
    keyboard.lastKeyPressedTime = new Date().getTime();
    world = new World(canvas, keyboard)
}

function cleanUp() {
    // 1. Alle Timer stoppen // noch NICHT implementiert
    stopGame();
    // 2. World "zerstören"
    if (world) {
        world = null;
    }
    // 3. Level zurücksetzen  
    level1 = null;
    // 4. Canvas leeren
    if (canvas) {
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    // 5. Keyboard zurücksetzen
    keyboard = new Keyboard();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.code === 'KeyW') {
        keyboard.SPACE = true;
    }
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
        keyboard.LEFT = true;
    }
    if (e.key === 'ArrowRight' || e.code === 'KeyD') {
        keyboard.RIGHT = true;
    }
    if (e.key === 'ArrowDown' || e.code === 'KeyS') {
        keyboard.DOWN = true;
    }
    if (e.key === ' ' || e.code === 'Space') {
        keyboard.SPACE = true;
    }
    if (e.key === 'F' || e.code === 'KeyF') {
        keyboard.F = true;
    }
    if (e.key === 'R' || e.code === 'KeyR') {
        keyboard.R = true;
    }
    keyboard.lastKeyPressedTime = new Date().getTime();
});

document.addEventListener('keyup', (e) => {

    if (e.key === 'ArrowUp' || e.code === 'KeyW') {
        keyboard.SPACE = false;
    }
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
        keyboard.LEFT = false;
    }
    if (e.key === 'ArrowRight' || e.code === 'KeyD') {
        keyboard.RIGHT = false;
    }
    if (e.key === 'ArrowDown' || e.code === 'KeyS') {
        keyboard.DOWN = false;
    }
    if (e.key === ' ' || e.code === 'Space') {
        keyboard.SPACE = false;
    }
    if (e.key === 'F' || e.code === 'KeyF') {
        keyboard.F = false;
    }
    if (e.key === 'R' || e.code === 'KeyR') {
        keyboard.R = false;
    }
});