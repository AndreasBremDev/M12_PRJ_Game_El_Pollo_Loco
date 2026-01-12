class MovableObject extends DrawableObject {

    speedX = 1;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    health = 100;
    lastHit = 0;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                // this.y = 235;
                this.speedY = 0;
            };
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 235;
        }
    }

    // character.isColliding(chicken);
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    hit() {
        if (this.health <= 100 && this.health > 0) {
            this.health -= 20;
            console.log('Character health: ', this.health);
            for(let i = 0; i < 10; i++) {
                this.x += -20;
            // push back
            // only one hit at a time (indirectly done)
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
        return this.health == 0;
    }


    playAnimation(images, speed = 4) {
        if (!this.animationCounter) this.animationCounter = 0;
        this.animationCounter++;
        if (this.animationCounter >= speed) {
            this.animationCounter = 0;
            let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }
    }

    moveRight() {
        this.x += this.speedX;
    }

    moveLeft() {
        this.x -= this.speedX;
    }




}