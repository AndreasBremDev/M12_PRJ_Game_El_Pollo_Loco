/**
 * Represents a small chicken enemy with jumping behavior.
 * @extends MovableObject
 */
/**
 * Represents a small chicken enemy with jumping behavior.
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {

    width = 50;
    height = 50;
    y = 380;
    health = 20;

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    offset = {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    };


    /**
     * Creates a new ChickenSmall object.
     * @param {number} x - The x-coordinate where the small chicken is placed.
     * @param {Sounds} sounds - The sound manager instance.
     */
    constructor(x, sounds) {
        super();
        this.sounds = sounds;
        this.x = x;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
        this.speedX = 0.15 + Math.random() * 0.85;
        this.applyGravity();
        this.lastJumpTime = 0;
        this.nextJumpDelay = this.getRandomJumpDelay();

    }

    /**
     * Sets intervals for small chicken movements, animations and removal.
     */
    animate() {
        let smallChickenMovements = setStoppableInterval(() => {
            this.moveLeft();
            this.checkRandomJump();
        }, 1000 / 60);

        let smallChickenAnimations = setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 100);

        let smallChickenRemoval = setStoppableInterval(() => {
            if (this.x < -300 - this.width) {
                clearInterval(smallChickenMovements);
                clearInterval(smallChickenAnimations);
                clearInterval(smallChickenRemoval);

            }
        }, 100);
    }

    /**
     * Generates a random delay for the next jump.
     * @returns {number} Delay in milliseconds.
     */
    getRandomJumpDelay() {
        return 1000 + Math.random() * 1000;
    }
    
    /**
     * Checks if it's time for the small chicken to jump based on a random delay.
     */
    checkRandomJump() {
        let currentTime = new Date().getTime();

        if (currentTime - this.lastJumpTime > this.nextJumpDelay) {
            this.jump();
            this.lastJumpTime = currentTime;
            this.nextJumpDelay = this.getRandomJumpDelay();
        }
    }
}
