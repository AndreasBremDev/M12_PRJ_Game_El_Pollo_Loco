/**
 * Represents a background object in the game that can move.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;

    /**
     * Creates a new BackgroundObject.
     * @param {string} imagePath - The path to the image file.
     * @param {number} x - The x-coordinate where the object is placed.
     */
    constructor(imagePath, x){
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }

}
