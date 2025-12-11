class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    SPACE = false;

    constructor() {

    }

    keyDownHandler(e) {
        if (e.key === 'ArrowLeft' || e.key === 'A') {
            this.LEFT = true;
        }
    }

    keyUpHandler(e) {
        if (e.key === 'ArrowLeft' || e.key === 'A') {
            this.LEFT = false;
        }
    }

}