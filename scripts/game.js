let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');

    initLevel();

    world = new World(canvas, keyboard)
    
    // console.log('My Character is', world.character);

}

document.addEventListener('keydown', (e) => {
    // console.log(e);

    if (e.key === 'ArrowUp' || e.code === 'KeyW') {
        keyboard.UP = true;
        isAnyKeyHeldDown = true;
    }
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
        keyboard.LEFT = true;
        isAnyKeyHeldDown = true;
    }
    if (e.key === 'ArrowRight' || e.code === 'KeyD') {
        keyboard.RIGHT = true;
        isAnyKeyHeldDown = true;
    }
    if (e.key === 'ArrowDown' || e.code === 'KeyS') {
        keyboard.DOWN = true;
        isAnyKeyHeldDown = true;
    }
    if (e.key === ' ' || e.code === 'Space') {
        keyboard.SPACE = true;
        isAnyKeyHeldDown = true;
    }
    if (e.key === 'F' || e.code === 'KeyF') {
        keyboard.F = true;
        isAnyKeyHeldDown = true;
    }

});

document.addEventListener('keyup', (e) => {

    if (e.key === 'ArrowUp' || e.code === 'KeyW') {
        keyboard.UP = false;
        isAnyKeyHeldDown = false;
    }
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
        keyboard.LEFT = false;
        isAnyKeyHeldDown = false;
    }
    if (e.key === 'ArrowRight' || e.code === 'KeyD') {
        keyboard.RIGHT = false;
        isAnyKeyHeldDown = false;
    }
    if (e.key === 'ArrowDown' || e.code === 'KeyS') {
        keyboard.DOWN = false;
        isAnyKeyHeldDown = false;
    }
    if (e.key === ' ' || e.code === 'Space') {
        keyboard.SPACE = false;
        isAnyKeyHeldDown = false;
    }
    if (e.key === 'F' || e.code === 'KeyF') {
        keyboard.F = false;
        isAnyKeyHeldDown = false;
    }
});