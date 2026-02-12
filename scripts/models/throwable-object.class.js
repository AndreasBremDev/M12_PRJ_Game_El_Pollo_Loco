/**
 * Base class for throwable objects like bottles.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {


    /**
     * Creates a new ThrowableObject instance.
     * @param {number} x - The x-coordinate where the object starts.
     * @param {number} y - The y-coordinate where the object starts.
     */
    constructor(x, y) {
        super();
        this.loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.hasLanded = false;
    }


}
