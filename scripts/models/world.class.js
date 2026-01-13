class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBarHealth();
    statusBarCoins = new StatusBarCoins();
    statusBarBottles = new StatusBarBottles();
    throwableObjects = [];
    lastThrowTime = 0;
    throwCooldown = 750;
    coins;
    coinsCollected = 0;
    bottlesCollected = 0;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        // this.collisionIntervalId = null;
        this.run();

    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        /* this.collisionIntervalId =  */
        setInterval(() => {

            this.checkCollisionsEnemy();
            // this.checkCollisionsEnemyTop();

            this.checkThrowObjects();

            this.ckeckCollisions(this.level.coins, this.statusBarCoins, 'coinsCollected');
            this.ckeckCollisions(this.level.bottles, this.statusBarBottles, 'bottlesCollected');

        }, 1000 / 60);
    }

    ckeckCollisions(array, statusBar, collected) {
        for (let i = array.length - 1; i >= 0; i--) {
            let element = array[i];
            if (this.character.isColliding(element)) {
                this[collected] += 20;
                array.splice(i, 1);
                statusBar.setPercentage(this[collected]);
            }
        }
    }

    checkCollisionsEnemy() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isCollidingTop(enemy) && enemy instanceof Chicken && this.isFalling()) {
                this.level.enemies.splice(index, 1);
            } else if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBarHealth.setPercentage(this.character.health);
            } else if (this.throwableObjects.length > 0 && this.throwableObjects[0].isColliding(enemy)) {
                this.level.enemies.splice(index, 1);
                this.throwableObjects.splice(0, 1);
            }  
        });
    }

    isFalling() {
        return this.character.speedY < 0;
    }

    checkThrowObjects() {
        if (this.keyboard.F && this.cooldown() && this.bottlesCollected > 0) {
            this.lastThrowTime = new Date().getTime();
            let bottle = new Bottle(this.character.x + 50, this.character.y + 100, this.keyboard);
            this.throwableObjects.push(bottle);
            this.bottlesCollected -= 20;
            this.statusBarBottles.setPercentage(this.bottlesCollected);
        }
    }

    cooldown() {
        let currentTime = new Date().getTime();
        return currentTime - this.lastThrowTime >= this.throwCooldown;
    }



    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);

        let self = this
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}