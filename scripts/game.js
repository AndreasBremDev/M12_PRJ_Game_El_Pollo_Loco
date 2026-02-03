let canvas = document.getElementById('canvas');
let world;
let keyboard = new Keyboard();

function startGame() {
    initLevel();
    keyboard.lastKeyPressedTime = new Date().getTime();
    world = new World(canvas, keyboard, window.sounds)
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function endGame() {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    stopGame();
    if (world) {
        world.endWorld();
        world = null;
    }
    keyboard.LEFT = keyboard.RIGHT = keyboard.UP = keyboard.DOWN = keyboard.SPACE = keyboard.F = keyboard.R = false;
    if (window.sounds) {
        window.sounds.stop(window.sounds.CHARACTER_WALK);
        window.sounds.stop(window.sounds.CHARACTER_CROUCHING);
        window.sounds.stop(window.sounds.BACKGROUND_GAME);
        window.sounds.stop(window.sounds.BACKGROUND_ENDBOSS);
    }
    level1 = null;
    keyboard = new Keyboard();
}

function handleKeyDown(e) {
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
};

function handleKeyUp(e) {
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
};

// document.getElementById('btnLeft').addEventListener('touchstart', (e) => { 
//     e.preventDefault();
//     keyboard.LEFT = true; 
// });
// document.getElementById('btnLeft').addEventListener('touchend', (e) => { 
//     e.preventDefault();
//     keyboard.LEFT = false; 
// });

// document.getElementById('btnRight').addEventListener('touchstart', (e) => { 
//     e.preventDefault();
//     keyboard.RIGHT = true; 
// });
// document.getElementById('btnRight').addEventListener('touchend', (e) => { 
//     e.preventDefault();
//     keyboard.RIGHT = false; 
// });

// document.getElementById('btnUp').addEventListener('touchstart', (e) => { 
//     e.preventDefault();
//     keyboard.SPACE = true; 
// });
// document.getElementById('btnUp').addEventListener('touchend', (e) => { 
//     e.preventDefault();
//     keyboard.SPACE = false; 
// });

// document.getElementById('btnAttOne').addEventListener('touchstart', (e) => { 
//     e.preventDefault();
//     keyboard.F = true; 
// });
// document.getElementById('btnAttOne').addEventListener('touchend', (e) => { 
//     e.preventDefault();
//     keyboard.F = false; 
// });

// document.getElementById('btnAttTwo').addEventListener('touchstart', (e) => { 
//     e.preventDefault();
//     keyboard.R = true; 
// });
// document.getElementById('btnAttTwo').addEventListener('touchend', (e) => { 
//     e.preventDefault();
//     keyboard.R = false; 
// });
