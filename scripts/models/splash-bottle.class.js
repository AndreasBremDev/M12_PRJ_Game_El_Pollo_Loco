/**
 * Represents the splash animation effect when a bottle breaks.
 * @extends ThrowableObject
 */
class SplashBottle extends ThrowableObject {

    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates a new SplashBottle object.
     * @param {number} x - The x-coordinate of the splash.
     * @param {number} y - The y-coordinate of the splash.
     * @param {SoundManager} sounds - The sound manager instance.
     */
    constructor(x, y, sounds) {
        super(x, y);
        this.sounds = sounds;
        this.sounds.playOnce(this.sounds.BOTTLE_SPLASH);
        this.loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_SPLASH);
        this.splashFrameCount = 0;
        this.animationComplete = false;
        this.animate();
    }

    /**
     * Sets an interval to play the splash animation once.
     */
    animate() {
        this.bottleSplashAnimation = setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_SPLASH, 4);
            this.splashFrameCount++;
            if (this.splashFrameCount >= this.IMAGES_SPLASH.length * 4) {
                this.animationComplete = true;
                clearInterval(this.bottleSplashAnimation);
            }
        }, 1000 / 25);
    }

}
