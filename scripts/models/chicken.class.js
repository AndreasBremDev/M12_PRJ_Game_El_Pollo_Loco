/**
 * Represents a normal chicken enemy.
 * @extends MovableObject
 */
class Chicken extends MovableObject {

    width = 50;
    height = 50;
    y = 380;
    health = 20;

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    offset = {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    };

    /**
     * Creates a new Chicken object.
     * @param {number} x - The x-coordinate where the chicken is placed.
     * @param {SoundManager} sounds - The sound manager instance.
     */
    constructor(x, sounds) {
        super();
        this.sounds = sounds;
        this.x = x;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
        this.speedX = 0.10 + Math.random() * 0.4;

    }

    /**
     * Sets intervals for chicken movements, animations and removal.
     */
    animate() {
        let chickenMovements = setStoppableInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        let chickenAnimations = setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 100);

        let chickenRemoval = setStoppableInterval(() => {
            if (this.x < -300 - this.width) {
                clearInterval(chickenMovements);
                clearInterval(chickenAnimations);
                clearInterval(chickenRemoval);
            }
        }, 100);
    }

}
