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

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

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

    isAboveGround() {
        if (this instanceof ThrowableObject || this instanceof ChickenDead || this instanceof ChickenSmall || this instanceof Chicken) {
            return this.y < 380 - this.isAboveGroundOffset;
        } else if (this instanceof Character) {
            return this.y < 235 - this.isAboveGroundOffset;
        } else if (this instanceof Endboss) {
            return this.y < 160 - this.isAboveGroundOffset;
        }
    }

    applyGroundLevel(mo) {
        if (mo instanceof ThrowableObject || mo instanceof ChickenDead || mo instanceof ChickenSmall || mo instanceof Chicken) {
            mo.y = 380;
        } else if (mo instanceof Character) {
            mo.y = 235;
        } else if (mo instanceof Endboss) {
            mo.y = 160;
        }
    }

    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    isCollidingTop(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.y + this.height - this.offset.bottom < mo.y + mo.offset.top + 30 &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right
    }

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

    applyDamage() {
        this.health -= 20;
        this.isCurrentlyHurt = true;
        this.lastHit = new Date().getTime();
        this.playHitSound();
        this.characterPushBack();
        this.endbossSetHurtAnimationPhase()
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        if (this instanceof Character) {
            if (timePassed > 1000) {
                this.isCurrentlyHurt = false;
            }
            return timePassed < 1000;
        } else if (this instanceof Endboss) {
            if (timePassed > 1500) { // set to 3000 (100 for testing only)
                this.isCurrentlyHurt = false;
            }
            return timePassed < 1500;// set to 3000 (100 for testing only)
        }
    }

    playHitSound() {
        if (this instanceof Character) {
            this.sounds.playOnce(this.sounds.CHARACTER_HURT)
        } else {
            this.sounds.playOnce(this.sounds.CHICKEN_ENDBOSS_HURT);
        }
    }

    characterPushBack() {
        (this instanceof Character) && Array.from({ length: 10 }).forEach(() => this.x -= 20);
    }

    endbossSetHurtAnimationPhase() {
        if (this instanceof Endboss) {
            this.currentPhase = 'hurt';
            // this.pendingPhase = this.phaseSequence[this.endbossHitCounter] || 'widthdraw';
        }
    }

    isDead() {
        return this.health < 20;
    }

    jump(speedY = 20) {
        this.speedY = speedY;
    }


    moveRight(speedX = this.speedX) {
        if (this.crouching === true) {
            this.x += speedX / 2;
        } else {
            this.x += speedX;
        }
    }

    moveLeft(speedX = this.speedX) {
        if (this.crouching === true) {
            this.x -= speedX / 2;
        } else {
            this.x -= speedX;
        }
    }

    isIdle(time) {
        let timePassed = new Date().getTime() - this.world.keyboard.lastKeyPressedTime;
        if (time === 'short') { return timePassed < 7000; }
        if (time === 'long') {
            if (timePassed >= 7000) {
                this.sounds.playLoop(this.sounds.CHARACTER_LONG_IDLE);
                return true;
            } else {
                this.sounds.stop(this.sounds.CHARACTER_LONG_IDLE);
                return false;
            }
        }
    }
    /////////////////////////// CLEAN CODE, 14 lines !!! ///////////////////////////
    playAnimation(images, speed = 4, playOnce = false, loops = 1) {
        if (!this.animationCounter) this.animationCounter = 0;

        // EINFACHE LÖSUNG: Immer bei 0 starten + Flags zurücksetzen
        if (!this.animationStarted || this.currentImage >= images.length * loops) {
            this.currentImage = 0;
            this.animationStarted = true;
            this.animationCompleted = false; // ← RESET für neue Animation
        }

        this.animationCounter++;
        if (this.animationCounter >= speed) {
            this.animationCounter = 0;
            let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];

            // Erhöhe currentImage ZUERST
            this.currentImage++;

            // DANN prüfe, ob Animation komplett ist (mit Durchläufen)
            if (playOnce === true && this.currentImage >= images.length * loops) {
                this.animationCompleted = true;
                return this.animationCompleted;
            }
        }
    }

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
