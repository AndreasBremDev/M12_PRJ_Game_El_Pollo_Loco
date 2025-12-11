let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard)

    // console.log('My Character is', world.character);

}

document.addEventListener('keydown', (e) => {
    // console.log(e);
    
    if (e.key === 'ArrowUp' || e.code === 'KeyW') {
        keyboard.UP = true;
        world.character.jump();
    } 
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
        keyboard.LEFT = true;
        world.character.moveCharacterLeft();
    }
    if (e.key === 'ArrowRight' || e.code === 'KeyD') {
        keyboard.RIGHT = true;
        world.character.moveRight();
    }
    if (e.key === 'ArrowDown' || e.code === 'KeyS') {
        keyboard.RIGHT = true;
        world.character.moveRight();
    }
    if (e.key === ' ' || e.code === 'Space') {
        keyboard.SPACE = true;
        world.character.jump();
    }
    
});

document.addEventListener('keyup', (e) => {
    console.log(e);
    
    if (e.key === 'ArrowUp' || e.code === 'KeyW') {
        keyboard.UP = false;
    } 
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
        keyboard.LEFT = false;
    }
    if (e.key === 'ArrowRight' || e.code === 'KeyD') {
        keyboard.RIGHT = false;
    }
    if (e.key === 'ArrowDown' || e.code === 'KeyS') {
        keyboard.RIGHT = false;
    }
    if (e.key === ' ' || e.code === 'Space') {
        keyboard.SPACE = false;
    }
});