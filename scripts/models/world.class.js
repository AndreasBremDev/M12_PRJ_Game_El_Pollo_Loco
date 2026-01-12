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
    throwCooldown = 500;
    coins;
    coinsCollected = 0;


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

            this.checkThrowObjects();

            this.checkCollisionsCoins();

        }, 1000 / 10);
    }

    checkThrowObjects() {
        if (this.keyboard.F && this.cooldown()) {
                let bottle = new Bottle(this.character.x + 50, this.character.y + 100, this.keyboard);
                this.throwableObjects.push(bottle);
                this.lastThrowTime = new Date().getTime();
        }
    }

    cooldown() {
        let currentTime = new Date().getTime();
        return currentTime - this.lastThrowTime >= this.throwCooldown;
    }

    checkCollisionsEnemy() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBarHealth.setPercentage(this.character.health);
            }
        });
    }
    checkCollisionsCoins() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.coinsCollected += 20;
                console.log('collected coins: ', this.coinsCollected);
                
                this.level.coins.splice(this.level.coins.indexOf(coin), 1);
                this.statusBarCoins.setPercentage(this.coinsCollected);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
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