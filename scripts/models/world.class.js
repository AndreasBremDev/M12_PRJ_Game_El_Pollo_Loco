class World {
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    camera_start_x = 0;
    camera_progress = 0;
    camera_progress_speed = 0.05;
    camera_target_x = 0;
    camera_speed = 0.2;
    camera_offset = 100;
    distanceToTarget = Math.abs(this.camera_x - this.camera_target_x);
    cameraInterpolationCompleted = false;
    gameRunning = true;
    statusBarHealth = new StatusBarHealth();
    statusBarCoins = new StatusBarCoins();
    statusBarBottles = new StatusBarBottles();
    statusBarEndbossHealth = new StatusBarEndbossHealth();
    throwableObjects = [];
    deadEnemies = [];
    endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    lastThrowTime = 0;
    attackOneCooldown = 750;
    attackTwoCooldown = 1500;
    lastJumpTime = 0;
    jumpProtectionTime = 300;
    coins;
    coinsCollected = 0;
    bottlesCollected = 0;

    constructor(canvas, keyboard, sounds) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.sounds = sounds;
        this.character = new Character(sounds);
        this.lastOtherDirection = this.character.otherDirection;
        this.lastCharacterX = this.character.x;
        this.draw();
        this.setWorld();
        this.run();
        this.sounds.volumeMuted['music'] ? this.sounds.mute(this.sounds.BACKGROUND_GAME) : this.sounds.playLoop(this.sounds.BACKGROUND_GAME, 'music');
        this.lastKeyPressedTime = new Date().getTime();
    }

    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
    }

    endWorld() {
        this.gameRunning = false;
        this.level.enemies = [];
        this.throwableObjects = [];
        this.deadEnemies = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    run() {
        let gameloop = setStoppableInterval(() => {
            this.checkCharacterEnemyCollisions();
            this.checkThrowObjects();
            this.checkBottleCollisionAttackOne();
            this.ckeckCollectableCollisions(this.level.coins, this.statusBarCoins, 'coinsCollected');
            this.ckeckCollectableCollisions(this.level.bottles, this.statusBarBottles, 'bottlesCollected');
            this.cleanupDeadEnemies();
            this.checkCharacterEndbossDistance();
        }, 1000 / 60);
    }

    draw() {
        if (!this.gameRunning) return;

        this.checkCameraMovement();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(Math.round(this.camera_x), 0);

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

        this.ctx.translate(Math.round(-this.camera_x), 0);

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

    checkCameraMovement() {
        if (this.character.otherDirection !== this.lastOtherDirection) {
            this.camera_offset = this.character.otherDirection ? 300 : 100;
            this.lastOtherDirection = this.character.otherDirection;
            this.cameraInterpolationCompleted = false;
        }
        this.camera_target_x = -this.character.x + this.camera_offset;
        !this.cameraInterpolationCompleted ? this.cameraInterpolation() : this.cameraFixValue(this.camera_offset);
    }

    cameraInterpolation() {
        if (Math.abs(this.camera_x - this.camera_target_x) <= 16) {
            this.camera_x = this.camera_target_x;
            this.cameraInterpolationCompleted = true;
            return;
        } else {
            this.camera_start_x = this.camera_x;
            this.camera_progress = 0;
            this.camera_progress += this.camera_progress_speed;
            let easeIn = 1 - Math.exp(-6 * this.camera_progress);
            this.camera_x = this.camera_start_x + (this.camera_target_x - this.camera_start_x) * easeIn;
        }
    }

    cameraFixValue(offset) {
        if (this.cameraInterpolationCompleted === true && this.character.x !== this.lastCharacterX) {
            this.camera_x = Math.round(-this.character.x + offset);
            this.lastCharacterX = this.character.x;
        }
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
        // mo.drawFrame(this.ctx);
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
                if (element instanceof Coins) {
                    this.sounds.playOnce(this.sounds.COLLECT_COIN);
                } else if (element instanceof Bottles) {
                    this.sounds.playOnce(this.sounds.COLLECT_BOTTLE);
                }
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
        if (!this.character.isCurrentlyHurt) { this.character.hit(); }
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
        if (this.keyboard.F && this.character.throwCooldown('one') && this.bottlesCollected > 0) {
            this.character.characterAttack('one');
        }
        if (this.keyboard.R && this.character.throwCooldown('two') && this.bottlesCollected > 0) {
            this.character.characterAttack('two');
        }
    }

    checkBottleCollisionAttackOne() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            let bottle = this.throwableObjects[i];
            this.handleBottleEnemyCollision(bottle);
            if (bottle instanceof ThrownBottle && !bottle.hasCollided) {
                if (bottle.y >= 380) { bottle.hasCollided = true }
                else if (Math.abs(bottle.x - this.character.x) > 720) { bottle.hasCollided = true }
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

            }
        }
    }

    criteriaBottleEnemyCollision(enemy, bottle, enemyType) {
        return bottle instanceof ThrownBottle && !bottle.hasCollided && bottle.isColliding(enemy) && enemy instanceof enemyType;
    }

    turnThrownBottleToSplashBottle(bottle, i) {
        this.throwableObjects.splice(i, 1);
        let splash = new SplashBottle(bottle.x, bottle.y, sounds);
        this.throwableObjects.push(splash);
    }

    killChicken(enemyIndex) {
        let enemy = this.level.enemies[enemyIndex];
        let chickenDead = new ChickenDead(enemy.x, enemy.y - 20, enemy);
        this.killedChickenPlaySounds(enemy);
        this.deadEnemies.push(chickenDead);
        this.level.enemies.splice(enemyIndex, 1);
    }

    killedChickenPlaySounds(enemy) {
        if (enemy instanceof Chicken) {
            this.sounds.playOnce(this.sounds.CHICKEN_DEAD);
        } else if (enemy instanceof ChickenSmall) {
            this.sounds.playOnce(this.sounds.CHICKEN_SMALL_DEAD);
        } else if (enemy instanceof Endboss) {
            this.sounds.playOnce(this.sounds.CHICKEN_ENDBOSS_DEAD);
        }
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

    checkCharacterEndbossDistance() {
        if (this.endboss.x - this.character.x < 600) {
            this.endboss.hadFirstContact = true;
        }
    }




}
