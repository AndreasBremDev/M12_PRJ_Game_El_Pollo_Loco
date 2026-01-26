class MovableObject extends DrawableObject {

    speedX = 1;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    health = 100;
    lastHit = 0;
    animationCompleted = false;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    applyGravity() {
        let gravity = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
            };
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject || this instanceof ChickenDead || this instanceof ChickenSmall || this instanceof Chicken) {
            return this.y < 380;
        } else if (this instanceof Character) {
            return this.y < 235;
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
        if (this.health <= 100 && this.health > 0) {
            this.health -= 20;
            if (this instanceof Character) {
                for (let i = 0; i < 10; i++) {
                    this.x += -20;
                    // only one hit at a time (indirectly (!) - still open task here - // issue: character can be hit multiple times within isHurt())
                }
            }
        }
        if (this.health <= 0) {
            this.health = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 1000;
    }

    isDead() {
        return this.health < 20;
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

    moveRight() {
        if (this.currentStatus === 'crouching') {
            this.x += this.speedX / 2;
        } else {
            this.x += this.speedX;
        }
    }

    moveLeft() {
        if (this.currentStatus === 'crouching') {
            this.x -= this.speedX / 2;
        } else {
            this.x -= this.speedX;
        }
    }

    isIdle(time) {
        let timePassed = new Date().getTime() - this.world.keyboard.lastKeyPressedTime;
        if (time === 'short') { return timePassed < 5000; }
        if (time === 'long') { return timePassed >= 5000; }
    }

}
