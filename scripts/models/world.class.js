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
    statusBarEndbossHealth = new StatusBarEndbossHealth();
    throwableObjects = [];
    lastThrowTime = 0;
    throwCooldown = 750;
    lastJumpTime = 0;
    jumpProtectionTime = 300;
    coins;
    coinsCollected = 0;
    bottlesCollected = 0;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();

    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {

            this.checkCollisionsEnemy();

            this.checkThrowObjects();
            this.checkBottleCollisions();

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

    // Endboss appear:
    // only appears, when character at this.x (1200) position (to do)

    checkCollisionsEnemy() {
        let currentTime = new Date().getTime();
        let isJumpProtected = currentTime - this.lastJumpTime < this.jumpProtectionTime;
        let jumpedThisFrame = false;
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            let enemy = this.level.enemies[i];
            if (this.criteriaTopCollisionWithChicken(enemy)) {
                jumpedThisFrame = this.actionsTopCollisionWithChicken(i, currentTime);
            } else if (this.criteriaGeneralCollisionWithEnemy(enemy, isJumpProtected, jumpedThisFrame)) {
                this.actionsGeneralCollisionEnemy();
            } else if (this.criteriaThrowableCollisionsWithChicken(enemy)) {
                this.actionsThrowableCollisionsWithChicken(i);
            } else if (this.criteriaThrowableCollisionsWithEndboss(enemy)) {
                this.actionsThrowableCollisionsWithEndboss(enemy);
            }
        }
    }



    criteriaThrowableCollisionsWithChicken(enemy) {
        return this.throwableObjects.length > 0 && this.throwableObjects[this.throwableObjects.length - 1].isColliding(enemy) && enemy instanceof Chicken;
    }

    actionsThrowableCollisionsWithChicken(i) {
        this.level.enemies.splice(i, 1);
        this.throwableObjects[this.throwableObjects.length - 1].hasCollided = true;
    }

    criteriaThrowableCollisionsWithEndboss(enemy) {
        return this.throwableObjects.length > 0 && this.throwableObjects[this.throwableObjects.length - 1].isColliding(enemy) && enemy instanceof Endboss;
    }

    actionsThrowableCollisionsWithEndboss(enemy) {
        enemy.hit();
        this.throwableObjects[this.throwableObjects.length - 1].hasCollided = true;
        this.statusBarEndbossHealth.setPercentage(enemy.health);
    }

    criteriaGeneralCollisionWithEnemy(enemy, isJumpProtected, jumpedThisFrame) {
        return this.character.isColliding(enemy) && !isJumpProtected && !jumpedThisFrame;
    }

    actionsGeneralCollisionEnemy() {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.health);
    }

    criteriaTopCollisionWithChicken(enemy) {
        return this.character.isCollidingTop(enemy) && enemy instanceof Chicken && this.character.speedY < 0;
    }

    actionsTopCollisionWithChicken(i, currentTime) {
        this.character.jump(15);
        this.level.enemies.splice(i, 1);
        this.lastJumpTime = currentTime;
        return true;
    }

    checkThrowObjects() {
        if (this.keyboard.F && this.cooldown() && this.bottlesCollected > 0) {
            this.lastThrowTime = new Date().getTime();
            let bottle = new ThrownBottle(this.character.x + 50, this.character.y + 100);
            this.character.attackOne(bottle);
            this.throwableObjects.push(bottle);
            this.bottlesCollected -= 20;
            this.statusBarBottles.setPercentage(this.bottlesCollected);
        }
    }

    checkBottleCollisions() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            let bottle = this.throwableObjects[i];
            
            // Prüfe ThrownBottle nur auf Boden-Kollision
            if (bottle instanceof ThrownBottle && !bottle.hasCollided) {
                if (bottle.y >= 380) {
                    bottle.hasCollided = true;
                }
            }
            
            // ThrownBottle → SplashBottle wechsel
            if (bottle instanceof ThrownBottle && bottle.hasCollided) {
                this.throwableObjects.splice(i, 1);
                let splash = new SplashBottle(bottle.x, bottle.y);
                this.throwableObjects.push(splash);
            }
            // SplashBottle nach Animation entfernen  
            else if (bottle instanceof SplashBottle && bottle.animationComplete) {
                this.throwableObjects.splice(i, 1);
            }
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
        if (this.character.x >= 1200) {
            this.addToMap(this.statusBarEndbossHealth);
        }

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
