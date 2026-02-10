let canvas = document.getElementById('canvas');
let world;
let keyboard = new Keyboard();

function startGame() {
    initLevel();
    keyboard.lastKeyPressedTime = Date.now();
    world = new World(canvas, keyboard, window.sounds)
    addKeyboardListeners();
    addTouchListeners();
}

function endGame() {
    removeKeyboardListeners();
    removeTouchListeners();
    stopGame();
    if (world) {
        world.endWorld();
        world = null;
    }
    keyboard.LEFT = keyboard.RIGHT = keyboard.UP = keyboard.DOWN = keyboard.SPACE = keyboard.F = keyboard.R = false;
    level1 = null;
    keyboard = new Keyboard();
}

function addKeyboardListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function addTouchListeners() {
    attachTouchHandler('btnLeft', handleLeftTouchStart, handleLeftTouchEnd);
    attachTouchHandler('btnRight', handleRightTouchStart, handleRightTouchEnd);
    attachTouchHandler('btnDown', handleDownTouchStart, handleDownTouchEnd);
    attachTouchHandler('btnUp', handleJumpTouchStart, handleJumpTouchEnd);
    attachTouchHandler('btnAttOne', handleAttackOneTouchStart, handleAttackOneTouchEnd);
    attachTouchHandler('btnAttTwo', handleAttackTwoTouchStart, handleAttackTwoTouchEnd);
}

function removeKeyboardListeners() {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
}

function removeTouchListeners() {
    unattachTouchHandler('btnLeft', handleLeftTouchStart, handleLeftTouchEnd);
    unattachTouchHandler('btnRight', handleRightTouchStart, handleRightTouchEnd);
    unattachTouchHandler('btnDown', handleDownTouchStart, handleDownTouchEnd);
    unattachTouchHandler('btnUp', handleJumpTouchStart, handleJumpTouchEnd);
    unattachTouchHandler('btnAttOne', handleAttackOneTouchStart, handleAttackOneTouchEnd);
    unattachTouchHandler('btnAttTwo', handleAttackTwoTouchStart, handleAttackTwoTouchEnd);
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

function attachTouchHandler(elementId, startHandler, endHandler) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.addEventListener('touchstart', startHandler);
    element.addEventListener('touchend', endHandler);
}
function unattachTouchHandler(elementId, startHandler, endHandler) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.removeEventListener('touchstart', startHandler);
    element.removeEventListener('touchend', endHandler);
}

function handleLeftTouchStart(e) {
    e.preventDefault();
    keyboard.LEFT = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

function handleLeftTouchEnd(e) {
    e.preventDefault();
    keyboard.LEFT = false;
}

function handleRightTouchStart(e) {
    e.preventDefault();
    keyboard.RIGHT = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

function handleRightTouchEnd(e) {
    e.preventDefault();
    keyboard.RIGHT = false;
}

function handleDownTouchStart(e) {
    e.preventDefault();
    keyboard.DOWN = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

function handleDownTouchEnd(e) {
    e.preventDefault();
    keyboard.DOWN = false;
}

function handleJumpTouchStart(e) {
    e.preventDefault();
    keyboard.SPACE = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

function handleJumpTouchEnd(e) {
    e.preventDefault();
    keyboard.SPACE = false;
}

function handleAttackOneTouchStart(e) {
    e.preventDefault();
    keyboard.F = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

function handleAttackOneTouchEnd(e) {
    e.preventDefault();
    keyboard.F = false;
}

function handleAttackTwoTouchStart(e) {
    e.preventDefault();
    keyboard.R = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

function handleAttackTwoTouchEnd(e) {
    e.preventDefault();
    keyboard.R = false;
}
