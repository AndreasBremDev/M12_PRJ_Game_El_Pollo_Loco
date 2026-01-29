let canvas = document.getElementById('canvas');
let world;
let keyboard = new Keyboard();
let sounds = new Sounds();

function startGame() {
    initLevel();
    keyboard.lastKeyPressedTime = new Date().getTime();
    world = new World(canvas, keyboard, sounds)
}

function endGame() {
    stopGame();
    if (world) {
        world.endWorld();
        world = null;
    }
    level1 = null;
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