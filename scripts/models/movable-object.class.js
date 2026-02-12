/**
 * Base class for all objects that can move, have health and interact with other objects.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {

    speedX = 1;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    health = 100;
    lastHit = 0;
    animationCompleted = false;
    isCurrentlyHurt = false;
    isAboveGroundOffset = 20;
    characterIsHurtTimeOffset = 1000;
    endbossIsHurtTimeOffset = 2000;
    endbossHurtProcessed = false;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    /**
     * Applies gravity to the object, pulling it down to the ground level.
     */
    applyGravity() {
        let gravity = setStoppableInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.applyGroundLevel(this);
                this.speedY = 0;
            };
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above its respective ground level.
     * @returns {boolean} True if the object is in the air.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject || this instanceof ChickenDead || this instanceof ChickenSmall || this instanceof Chicken) {
            return this.y < 380 - this.isAboveGroundOffset;
        } else if (this instanceof Character) {
            return this.y < 235 - this.isAboveGroundOffset;
        } else if (this instanceof Endboss) {
            return this.y < 160 - this.isAboveGroundOffset;
        }
    }

    /**
     * Resets the object's y-coordinate to its ground level.
     * @param {MovableObject} mo - The movable object.
     */
    applyGroundLevel(mo) {
        if (mo instanceof ThrowableObject || mo instanceof ChickenDead || mo instanceof ChickenSmall || mo instanceof Chicken) {
            mo.y = 380;
        } else if (mo instanceof Character) {
            mo.y = 235;
        } else if (mo instanceof Endboss) {
            mo.y = 160;
        }
    }

    /**
     * Checks if this object is colliding with another movable object.
     * @param {MovableObject} mo - The other movable object.
     * @returns {boolean} True if they are colliding.
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Checks if this object is colliding with the top part of another movable object (e.g., jumping on a chicken).
     * @param {MovableObject} mo - The other movable object.
     * @returns {boolean} True if colliding with the top.
     */
    isCollidingTop(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.y + this.height - this.offset.bottom < mo.y + mo.offset.top + 30 &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right
    }

    /**
     * Handles hitting this object, applying damage and playing sounds.
     */
    hit() {
        if (this.isCurrentlyHurt) {
            return;
        } else {
            if (this.health <= 100 && this.health > 20) {
                this.applyDamage();
            } else if (this.health <= 20) {
                this instanceof Character ? this.sounds.playOnce(this.sounds.CHARACTER_DEAD) : this.sounds.playOnce(this.sounds.CHICKEN_ENDBOSS_DEAD);
                this.health = 0;
            }
        }
    }

    /**
     * Applies damage to the object and updates its state.
     */
    applyDamage() {
        this.health -= 20;
        this.isCurrentlyHurt = true;
        this.lastHit = new Date().getTime();
        this.playHitSound();
        this.characterPushBack();
        this.endbossHurtProcessed = true;
    }

    /**
     * Checks if the object is currently in a "hurt" state (invincibility frames).
     * @returns {boolean} True if hurt.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        if (this instanceof Character) {
            if (timePassed > this.characterIsHurtTimeOffset) {
                this.isCurrentlyHurt = false;
            }
            return this.isCurrentlyHurt;
        } else if (this instanceof Endboss) {
            if (timePassed > this.endbossIsHurtTimeOffset) {
                this.isCurrentlyHurt = false;
            }
            return this.isCurrentlyHurt;
        }
    }

    /**
     * Plays the appropriate hit sound based on the object type.
     */
    playHitSound() {
        if (this instanceof Character) {
            this.sounds.playOnce(this.sounds.CHARACTER_HURT)
        } else {
            this.sounds.playOnce(this.sounds.CHICKEN_ENDBOSS_HURT);
        }
    }

    /**
     * Pushes the character back after receiving damage.
     */
    characterPushBack() {
        if ((this.world.character.x >= 0 && this.world.character.x <= 0 + 200) ||
            (this.world.character.x >= this.world.level.endboss_left_end_x - 8 && this.world.character.x <= this.world.level.endboss_left_end_x + 200)) { return; }
        else {
            (this instanceof Character) && Array.from({ length: 10 }).forEach(() => this.x -= 20);
        }
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean} True if health is below 20.
     */
    isDead() {
        return this.health < 20;
    }

    /**
     * Makes the object jump.
     * @param {number} [speedY=20] - Vertical speed of the jump.
     */
    jump(speedY = 20) {
        this.speedY = speedY;
    }

    /**
     * Moves the object to the right.
     * @param {number} [speedX=this.speedX] - Horizontal speed.
     */
    moveRight(speedX = this.speedX) {
        if (this.crouching === true) {
            this.x += speedX / 2;
        } else {
            this.x += speedX;
        }
    }

    /**
     * Moves the object to the left.
     * @param {number} [speedX=this.speedX] - Horizontal speed.
     */
    moveLeft(speedX = this.speedX) {
        if (this.crouching === true) {
            this.x -= speedX / 2;
        } else {
            this.x -= speedX;
        }
    }

    /**
     * Checks if the character is idle.
     * @param {'short'|'long'} time - The idle category.
     * @returns {boolean} True if idle condition met.
     */
    isIdle(time) {
        let timePassed = new Date().getTime() - this.world.keyboard.lastKeyPressedTime;
        if (time === 'short') { return timePassed < 12000; }
        if (time === 'long') {
            if (timePassed >= 12000) {
                this.sounds.playLoop(this.sounds.CHARACTER_LONG_IDLE);
                return true;
            } else {
                this.sounds.stop(this.sounds.CHARACTER_LONG_IDLE);
                return false;
            }
        }
    }

    /**
     * Plays an animation using an array of images.
     * @param {string[]} images - Array of image paths.
     * @param {number} [speed=4] - Speed of the animation (higher is slower).
     * @param {boolean} [playOnce=false] - Whether the animation should stop after one cycle.
     * @param {number} [loops=1] - Number of cycles to play.
     * @returns {boolean|undefined} Returns true if playOnce is set and animation completed.
     */
    playAnimation(images, speed = 4, playOnce = false, loops = 1) {
        if (!this.animationCounter) this.animationCounter = 0;
        if (!this.animationStarted || this.currentImage >= images.length * loops) {
            this.setAnimationStartSettings_playAnimation();
        }
        this.animationCounter++;
        if (this.animationCounter >= speed) {
            this.setCurrentImage_playAnimation(images);
            this.currentImage++;
            if (playOnce === true && this.currentImage >= images.length * loops) {
                this.animationCompleted = true;
                return this.animationCompleted;
            }
        }
    }

    /**
     * Resets animation flags and counter for a new animation cycle.
     */
    setAnimationStartSettings_playAnimation() {
        this.currentImage = 0;
        this.animationStarted = true;
        this.animationCompleted = false;
    }

    /**
     * Sets the current image for the animation.
     * @param {string[]} images - Array of image paths.
     */
    setCurrentImage_playAnimation(images) {
        this.animationCounter = 0;
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
    }

    /**
     * Plays a specialized attack animation with variable speed based on frame.
     * @param {string[]} images - Array of image paths.
     * @param {number} [speed=2] - Base speed.
     */
    playAttackTwoAnimation(images, speed = 2) {
        if (!this.animationCounter) this.animationCounter = 0;
        this.animationCounter++;
        let i = this.currentImage % images.length;
        let currentSpeed = speed * Math.pow(2, i);
        if (this.animationCounter >= currentSpeed) {
            this.animationCounter = 0;
            let path = images[i];
            this.img = this.imageCache[path];
            if (this.currentImage == images.length - 1) {
            } else {
                this.currentImage++;
            }
        }
    }

}
