/**
 * Represents a thrown bottle projectile.
 * @extends ThrowableObject
 */
class ThrownBottle extends ThrowableObject {

    IMAGES_ROTATE = [
        './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SQUEEZE = [
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_squeeze/1_bottle_squeeze1.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_squeeze/3_bottle_squeeze3.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_squeeze/4_bottle_squeeze4.png'
    ];

    /**
     * Creates a new ThrownBottle instance.
     * @param {number} x - The x-coordinate where the bottle starts.
     * @param {number} y - The y-coordinate where the bottle starts.
     * @param {'one'|'two'} [attackType='one'] - The attack type determining behavior.
     * @param {'left'|'right'} [direction='right'] - The throw direction.
     */
    constructor(x, y, attackType = 'one', direction = 'right') {
        super(x, y);
        this.otherDirection = direction === 'left';
        if (attackType == 'one') {this.loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');}
        if (attackType == 'two') {this.loadImage('./assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png');}
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SQUEEZE);
        this.attackType = attackType;
        this.startX = x;
        this.maxTravelDistance = 500;
        this.enemiesHit = new Set();
        this.hasCollided = false;
        this.animate();
    }

    /**
     * Starts the animation loop for the thrown bottle.
     */
    animate() {
        this.thrownBottleAnimations = setStoppableInterval(() => {
            if (this.attackType === 'one') {
                this.playAnimation(this.IMAGES_ROTATE, 1);
            } else if (this.attackType === 'two') {
                this.playAttackTwoAnimation(this.IMAGES_SQUEEZE, 1);
            }
            if (this.hasCollided) {
                clearInterval(this.animationInterval);
            }
        }, 1000 / 25);
    }


}
