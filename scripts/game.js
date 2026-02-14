let canvas = document.getElementById('canvas');
let world;
let keyboard = new Keyboard();

/**
 * Initializes the game and starts the world.
 */
function startGame() {
    initLevel();
    keyboard.lastKeyPressedTime = Date.now();
    world = new World(canvas, keyboard, window.sounds)
    addKeyboardListeners();
    addTouchListeners();
}

/**
 * Handles cleanup and UI flow when the game ends.
 * @param {'win'|'lose'|'replay'|'exit'} outcome - Result of the game.
 * @param {Event} [ev] - Optional event to stop propagation.
 */
function finishGame(outcome, ev) {
    if (ev) eventBlurAndStopPropagation(ev);
    if (!world || !world.gameRunning) return;
    world.gameRunning = false;
    endGame();
    if (outcome === 'win') {
        window.sounds.playOnce(window.sounds.ENDGAME_WIN, 'effect');
        showMenuTab('win');
    } else if (outcome === 'lose') {
        window.sounds.playOnce(window.sounds.ENDGAME_LOOSE, 'effect');
        showMenuTab('gameover');
    } else if (outcome === 'replay') {
        playGame();
    } else {
        showMenuTab('title', titleBg);
    }
}

/**
 * Stops looped or repeatable sound effects.
 */
function stopRepeatableSounds() {
    window.sounds.stop(window.sounds.BACKGROUND_GAME);
    window.sounds.stop(window.sounds.BACKGROUND_ENDBOSS);
    window.sounds.stop(window.sounds.CHARACTER_LONG_IDLE);
    window.sounds.stop(window.sounds.CHARACTER_WALK);
    window.sounds.stop(window.sounds.CHARACTER_CROUCHING);
}

/**
 * Cleans up state and listeners after ending a game session.
 */
function endGame() {
    stopRepeatableSounds();
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

/**
 * Registers keyboard input listeners.
 */
function addKeyboardListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

/**
 * Registers touch input listeners for on-screen controls.
 */
function addTouchListeners() {
    attachTouchHandler('btnLeft', handleLeftTouchStart, handleLeftTouchEnd);
    attachTouchHandler('btnRight', handleRightTouchStart, handleRightTouchEnd);
    attachTouchHandler('btnDown', handleDownTouchStart, handleDownTouchEnd);
    attachTouchHandler('btnUp', handleJumpTouchStart, handleJumpTouchEnd);
    attachTouchHandler('btnAttOne', handleAttackOneTouchStart, handleAttackOneTouchEnd);
    attachTouchHandler('btnAttTwo', handleAttackTwoTouchStart, handleAttackTwoTouchEnd);
}

/**
 * Removes keyboard input listeners.
 */
function removeKeyboardListeners() {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
}

/**
 * Removes touch input listeners for on-screen controls.
 */
function removeTouchListeners() {
    unattachTouchHandler('btnLeft', handleLeftTouchStart, handleLeftTouchEnd);
    unattachTouchHandler('btnRight', handleRightTouchStart, handleRightTouchEnd);
    unattachTouchHandler('btnDown', handleDownTouchStart, handleDownTouchEnd);
    unattachTouchHandler('btnUp', handleJumpTouchStart, handleJumpTouchEnd);
    unattachTouchHandler('btnAttOne', handleAttackOneTouchStart, handleAttackOneTouchEnd);
    unattachTouchHandler('btnAttTwo', handleAttackTwoTouchStart, handleAttackTwoTouchEnd);
}

/**
 * Handles keydown events for player input.
 * @param {KeyboardEvent} e - The keyboard event.
 */
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

/**
 * Handles keyup events for player input.
 * @param {KeyboardEvent} e - The keyboard event.
 */
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

/**
 * Attaches touchstart and touchend handlers to a control element.
 * @param {string} elementId - The element id.
 * @param {Function} startHandler - Handler for touchstart.
 * @param {Function} endHandler - Handler for touchend.
 */
function attachTouchHandler(elementId, startHandler, endHandler) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.addEventListener('touchstart', startHandler);
    element.addEventListener('touchend', endHandler);
}
/**
 * Removes touchstart and touchend handlers from a control element.
 * @param {string} elementId - The element id.
 * @param {Function} startHandler - Handler for touchstart.
 * @param {Function} endHandler - Handler for touchend.
 */
function unattachTouchHandler(elementId, startHandler, endHandler) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.removeEventListener('touchstart', startHandler);
    element.removeEventListener('touchend', endHandler);
}

/**
 * Handles touch start for moving left.
 * @param {TouchEvent} e - The touch event.
 */
function handleLeftTouchStart(e) {
    e.preventDefault();
    keyboard.LEFT = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

/**
 * Handles touch end for moving left.
 * @param {TouchEvent} e - The touch event.
 */
function handleLeftTouchEnd(e) {
    e.preventDefault();
    keyboard.LEFT = false;
}

/**
 * Handles touch start for moving right.
 * @param {TouchEvent} e - The touch event.
 */
function handleRightTouchStart(e) {
    e.preventDefault();
    keyboard.RIGHT = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

/**
 * Handles touch end for moving right.
 * @param {TouchEvent} e - The touch event.
 */
function handleRightTouchEnd(e) {
    e.preventDefault();
    keyboard.RIGHT = false;
}

/**
 * Handles touch start for crouching.
 * @param {TouchEvent} e - The touch event.
 */
function handleDownTouchStart(e) {
    e.preventDefault();
    keyboard.DOWN = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

/**
 * Handles touch end for crouching.
 * @param {TouchEvent} e - The touch event.
 */
function handleDownTouchEnd(e) {
    e.preventDefault();
    keyboard.DOWN = false;
}

/**
 * Handles touch start for jumping.
 * @param {TouchEvent} e - The touch event.
 */
function handleJumpTouchStart(e) {
    e.preventDefault();
    keyboard.SPACE = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

/**
 * Handles touch end for jumping.
 * @param {TouchEvent} e - The touch event.
 */
function handleJumpTouchEnd(e) {
    e.preventDefault();
    keyboard.SPACE = false;
}

/**
 * Handles touch start for attack one.
 * @param {TouchEvent} e - The touch event.
 */
function handleAttackOneTouchStart(e) {
    e.preventDefault();
    keyboard.F = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

/**
 * Handles touch end for attack one.
 * @param {TouchEvent} e - The touch event.
 */
function handleAttackOneTouchEnd(e) {
    e.preventDefault();
    keyboard.F = false;
}

/**
 * Handles touch start for attack two.
 * @param {TouchEvent} e - The touch event.
 */
function handleAttackTwoTouchStart(e) {
    e.preventDefault();
    keyboard.R = true;
    keyboard.lastKeyPressedTime = new Date().getTime();
}

/**
 * Handles touch end for attack two.
 * @param {TouchEvent} e - The touch event.
 */
function handleAttackTwoTouchEnd(e) {
    e.preventDefault();
    keyboard.R = false;
}
