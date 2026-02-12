/**
 * Represents a decorative cloud object in the background.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    y = 0;
    width = 720;
    height = 420;

    /**
     * Creates a new Cloud object.
     */
    constructor() {
        super();
        this.loadImage('./assets/img/5_background/layers/4_clouds/1.png');
        this.x = 0;
        this.speed = 0.1;
        this.animate()
    }

    /**
     * Animates the cloud by moving it to the left.
     */
    animate() {
        this.moveLeft();
    }



}
