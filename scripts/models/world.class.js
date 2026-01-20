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
    deadEnemies = [];
    endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    lastThrowTime = 0;
    throwCooldownLimit = 750;
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

    endWorld() {
        // Alle eigenen Timer stoppen
        clearInterval(this.gameLoopId);

        // Alle Arrays leeren
        this.level.enemies = [];
        this.throwableObjects = [];
        this.deadEnemies = [];

        // Canvas leeren
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    run() {
        setInterval(() => {

            this.checkCharacterEnemyCollisions();
            this.checkThrowObjects();
            this.checkBottleCollisions();
            this.ckeckCollectableCollisions(this.level.coins, this.statusBarCoins, 'coinsCollected');
            this.ckeckCollectableCollisions(this.level.bottles, this.statusBarBottles, 'bottlesCollected');
            this.cleanupDeadEnemies();

        }, 1000 / 60);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies.filter(enemy => enemy !== this.endboss));
        if (this.endboss.x - this.character.x < 600) {
            this.addObjectsToMap(this.level.enemies.filter(enemy => enemy === this.endboss));
        }
        this.addObjectsToMap(this.deadEnemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        if (this.endboss.x - this.character.x < 600) {
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

    ckeckCollectableCollisions(array, statusBar, collected) {
        for (let i = array.length - 1; i >= 0; i--) {
            let element = array[i];
            if (this.character.isColliding(element)) {
                this[collected] += 20;
                array.splice(i, 1);
                statusBar.setPercentage(this[collected]);
            }
        }
    }

    checkCharacterEnemyCollisions() {
        let currentTime = new Date().getTime();
        let isJumpProtected = currentTime - this.lastJumpTime < this.jumpProtectionTime;
        let jumpedThisFrame = false;
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            let enemy = this.level.enemies[i];
            if (this.criteriaTopCollisionWithChicken(enemy)) {
                jumpedThisFrame = this.actionsTopCollisionWithChicken(i, currentTime);
            } else if (this.criteriaGeneralCollisionWithEnemy(enemy, isJumpProtected, jumpedThisFrame)) {
                this.actionsGeneralCollisionEnemy();
            }
        }
    }

    criteriaGeneralCollisionWithEnemy(enemy, isJumpProtected, jumpedThisFrame) {
        return this.character.isColliding(enemy) && !isJumpProtected && !jumpedThisFrame;
    }

    actionsGeneralCollisionEnemy() {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.health);
    }

    criteriaTopCollisionWithChicken(enemy) {
        return this.character.isCollidingTop(enemy) && (enemy instanceof Chicken || enemy instanceof ChickenSmall) && this.character.speedY < 0;
    }

    actionsTopCollisionWithChicken(i, currentTime) {
        this.character.jump(10);
        this.killChicken(i);
        this.lastJumpTime = currentTime;
        return true;
    }

    checkThrowObjects() {
        if (this.keyboard.F && this.character.throwCooldown() && this.bottlesCollected > 0) {
            this.character.characterAttackOne();
        }
    }

    checkBottleCollisions() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            let bottle = this.throwableObjects[i];
            this.handleBottleEnemyCollision(bottle);
            if (bottle instanceof ThrownBottle && !bottle.hasCollided) {
                if (bottle.y >= 380) { bottle.hasCollided = true }
            }
            if (bottle instanceof ThrownBottle && bottle.hasCollided) {
                this.turnThrownBottleToSplashBottle(bottle, i);
            }
            else if (bottle instanceof SplashBottle && bottle.animationComplete) {
                this.throwableObjects.splice(i, 1);
            }
        }
    }

    handleBottleEnemyCollision(bottle) {
        for (let j = this.level.enemies.length - 1; j >= 0; j--) {
            let enemy = this.level.enemies[j];
            if (this.criteriaBottleEnemyCollision(enemy, bottle, Chicken) || this.criteriaBottleEnemyCollision(enemy, bottle, ChickenSmall)) {
                bottle.hasCollided = true;
                this.killChicken(j);
            } else if (this.criteriaBottleEnemyCollision(enemy, bottle, Endboss)) {
                bottle.hasCollided = true;
                enemy.hit();
                this.statusBarEndbossHealth.setPercentage(enemy.health);
                if (enemy.health < 20) {
                    this.killChicken(j);
                }
            }
        }
    }

    criteriaBottleEnemyCollision(enemy, bottle, enemyType) {
        return bottle instanceof ThrownBottle && !bottle.hasCollided && bottle.isColliding(enemy) && enemy instanceof enemyType;
    }

    turnThrownBottleToSplashBottle(bottle, i) {
        this.throwableObjects.splice(i, 1);
        let splash = new SplashBottle(bottle.x, bottle.y);
        this.throwableObjects.push(splash);
    }

    killChicken(enemyIndex) {
        let enemy = this.level.enemies[enemyIndex];
        let chickenDead = new ChickenDead(enemy.x, enemy.y - 20, enemy);
        this.deadEnemies.push(chickenDead);
        this.level.enemies.splice(enemyIndex, 1);
    }

    cleanupDeadEnemies() {
        let currentTime = new Date().getTime();
        for (let i = this.deadEnemies.length - 1; i >= 0; i--) {
            let deadEnemy = this.deadEnemies[i];
            if (currentTime - deadEnemy.createdTime > 1000) {
                this.deadEnemies.splice(i, 1);
            }
        }
    }



}
