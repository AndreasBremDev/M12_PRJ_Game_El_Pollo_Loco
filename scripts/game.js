let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard)

    // console.log('My Character is', world.character);

}

document.addEventListener('keydown', (e) => {
    console.log(e);
    
    if (e.key === 'ArrowUp' || e.code === 'KeyW') {
        console.log("ArrowUp or W pressed");
        keyboard.UP = true;
        world.character.jump();
    } 
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
        console.log("ArrowLeft or A pressed");
        keyboard.LEFT = true;
        world.character.moveCharacterLeft();
    }
    if (e.key === 'ArrowRight' || e.code === 'KeyD') {
        console.log("ArrowRight or D pressed");
        keyboard.RIGHT = true;
        world.character.moveRight();
    }
    if (e.key === 'ArrowDown' || e.code === 'KeyS') {
        console.log("ArrowRight or D pressed");
        keyboard.RIGHT = true;
        world.character.moveRight();
    }
    if (e.key === ' ' || e.code === 'Space') {
        console.log("Space pressed");
        keyboard.SPACE = true;
        world.character.jump();
    }
    
});

document.addEventListener('keyup', (e) => {
    console.log(e);
    
    if (e.key === 'ArrowUp' || e.code === 'KeyW') {
        console.log("ArrowUp or W pressed");
        keyboard.UP = false;
        world.character.jump();
    } 
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
        console.log("ArrowLeft or A pressed");
        keyboard.LEFT = false;
        world.character.moveCharacterLeft();
    }
    if (e.key === 'ArrowRight' || e.code === 'KeyD') {
        console.log("ArrowRight or D pressed");
        keyboard.RIGHT = false;
        world.character.moveRight();
    }
    if (e.key === 'ArrowDown' || e.code === 'KeyS') {
        console.log("ArrowRight or D pressed");
        keyboard.RIGHT = false;
        world.character.moveRight();
    }
    if (e.key === ' ' || e.code === 'Space') {
        console.log("Space pressed");
        keyboard.SPACE = false;
        world.character.jump();
    }
});