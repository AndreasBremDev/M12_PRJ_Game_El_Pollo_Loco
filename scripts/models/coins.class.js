/**
 * Represents a collectible coin in the game.
 * @extends MovableObject
 */
class Coins extends MovableObject {

    width = 100;
    height = 100;

    IMAGES_COINS = [
        './assets/img/8_coin/coin_1.png',
        './assets/img/8_coin/coin_2.png'
    ];

    offset = { 
        top: 35,
        left: 35,
        right: 35,
        bottom: 35
    };

    /**
     * Creates a new Coins object.
     * @param {number} x - The x-coordinate where the coin is placed.
     * @param {number} y - The y-coordinate where the coin is placed.
     * @param {SoundManager} sounds - The sound manager instance.
     */
    constructor(x, y, sounds) {
        super();
        this.sounds = sounds;
        this.loadImage('./assets/img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.loadImages(this.IMAGES_COINS);
        this.animate();

    }

    /**
     * Sets intervals for coin animations.
     */
    animate() {
        let coinAnimations = setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 1000 / 10);
    }

}
