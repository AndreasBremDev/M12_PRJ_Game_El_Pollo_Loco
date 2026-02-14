/**
 * Represents the game world, managing the canvas, levels, characters, and interactions.
 * lerpFactor between 0.05 - 0.1 is best for smooth camera movement.
 */
class World {
    level = level1;
    canvas;
    ctx;
    keyboard;
    enemyManager;
    statusBarBottles = new StatusBars(20, 90, 'bottles');
    statusBarCoins = new StatusBars(20, 40, 'coins');
    statusBarEndbossHealth = new StatusBars(490, 97, 'endboss');
    statusBarHealth = new StatusBars(20, -10, 'health');
    throwableObjects = [];
    deadEnemies = [];
    endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    attackOneLastThrowTime = 0;
    attackOneCooldown = 750;
    attackTwoLastThrowTime = 0;
    attackTwoCooldown = 10000;
    lastJumpTime = 0;
    jumpProtectionTime = 300;
    coins;
    coinsCollected = 0;
    bottlesCollected = 0;
    endbossMet = false;
    endbossMusicActive = false;
    gameRunning = true;

    /**
     * Creates a new World instance.
     * @param {HTMLCanvasElement} canvas - The HTML canvas element.
     * @param {Keyboard} keyboard - The keyboard input handler.
     * @param {SoundManager} sounds - The sound manager instance.
     */
    constructor(canvas, keyboard, sounds) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.sounds = sounds;
        this.character = new Character(sounds);
        this.enemyManager = new EnemyManager(this);
        this.draw();
        this.setWorld();
        this.run();
        this.sounds.playLoop(this.sounds.BACKGROUND_GAME, 'music');
        this.lastKeyPressedTime = new Date().getTime();
    }

    /**
     * Sets the world reference for the character and endboss.
     */
    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
    }

    /**
     * Cleans up the world state when the game ends.
     */
    endWorld() {
        this.gameRunning = false;
        this.endbossMet = this.endbossMusicActive = false;
        this.level.enemies = [];
        this.throwableObjects = [];
        this.deadEnemies = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Starts the main game logic interval.
     */
    run() {
        let gameloop = setStoppableInterval(() => {
            this.checkCharacterEnemyCollisions();
            this.checkThrowObjects();
            this.checkBottleCollisionAttackOneAndTwo();
            this.ckeckCollectableCollisions(this.level.coins, this.statusBarCoins, 'coinsCollected', this.statusBarCoins.IMAGES_COINS);
            this.ckeckCollectableCollisions(this.level.bottles, this.statusBarBottles, 'bottlesCollected', this.statusBarBottles.IMAGES_BOTTLES);
            this.enemyManager.cleanupDeadEnemies();
            this.enemyManager.cleanupOffscreenEnemies();
            this.checkIsMutedStatus();
            this.checkIfEndbossMet();
            this.activateEndbossMusic();
        }, 1000 / 60);
    }

    /**
     * Main draw loop, clears canvas and renders all game objects.
     */
    draw() {
        if (!this.gameRunning) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(Math.round(this.character.camera_x), 0);
        this.addLevelObjects();
        this.addToMap(this.character);
        this.ctx.restore();
        this.addStatusBars();
        let self = this
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Adds level-specific objects to the map.
     */
    addLevelObjects() {
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
    }

    /**
     * Renders all status bars on the canvas.
     */
    addStatusBars() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        if (this.endboss.x - this.character.x < 600) {
            this.addToMap(this.statusBarEndbossHealth);
        }
    }

    /**
     * Checks and applies the mute status for music and effects.
     */
    checkIsMutedStatus() {
        this.sounds.applyMuteState('music')
        this.sounds.applyMuteState('effect')
    }

    /**
     * Checks if the character has reached the endboss.
     */
    checkIfEndbossMet() {
        if (!this.endbossMet && this.character.x > this.endboss.x - 600) {
            this.endbossMet = true;
            this.endbossMusicActive = true;
            if (!this.endboss.currentPhase) {
                this.endboss.switchPhase('alert');
                this.endboss.waitingStartTime = new Date().getTime();
            }
        }
    }

    /**
     * Switches background music to endboss theme when met.
     */
    activateEndbossMusic() {
        if (!this.endbossMusicActive) return;
        if (this.sounds.volumeIsMuted.music) {
            return;
        } else {
            this.endbossMusicActive = false;
            this.sounds.pause(this.sounds.BACKGROUND_GAME, 'music');
            this.sounds.playLoop(this.sounds.BACKGROUND_ENDBOSS, 'music');
        }
        if (!this.sounds.volumeIsMuted.effect) {
            this.sounds.playOnce(this.sounds.CHICKEN_ENDBOSS_ATTACK, 'effect');
        }
    }

    /**
     * Adds an array of objects to the map.
     * @param {DrawableObject[]} objects - Array of drawable objects.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single object to the map, handling direction flipping.
     * @param {MovableObject} mo - The movable object.
     */
addToMap(mo) {
    if (mo.otherDirection) {
        this.flipImage(mo);
        mo.drawAtZero(this.ctx); 
        this.flipImageBack();
    } else {
        mo.draw(this.ctx);
    }
}

    /**
     * Flips the image horizontally for the specified object.
     * @param {MovableObject} mo - The movable object.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(Math.round(mo.x + mo.width), 0);
        this.ctx.scale(-1, 1);
    }

    /**
     * Restores the image direction after flipping.
     * @param {MovableObject} mo - The movable object.
     */
    flipImageBack(mo) {
        this.ctx.restore();
    }

    /**
     * Checks for collisions between character and collectable items.
     * @param {DrawableObject[]} array - Array of collectables.
     * @param {DrawableObject} statusBar - The corresponding status bar.
     * @param {string} collected - The property name for collected count.
     */
    ckeckCollectableCollisions(array, statusBar, collected, imagesArray) {
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
                statusBar.setPercentage(this[collected], imagesArray);
            }
        }
    }

    /**
     * Main function to check character collisions with enemies.
     */
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

    /**
     * Criteria for general collision with an enemy.
     * @param {MovableObject} enemy - The enemy object.
     * @param {boolean} isJumpProtected - If jump protection is active.
     * @param {boolean} jumpedThisFrame - If character already jumped this frame.
     * @returns {boolean} True if criteria met.
     */
    criteriaGeneralCollisionWithEnemy(enemy, isJumpProtected, jumpedThisFrame) {
        return this.character.isColliding(enemy) && !isJumpProtected && !jumpedThisFrame;
    }

    /**
     * Actions to perform when a general collision occurs.
     */
    actionsGeneralCollisionEnemy() {
        if (!this.character.isCurrentlyHurt) { this.character.hit(); }
        this.statusBarHealth.setPercentage(this.character.health, this.statusBarHealth.IMAGES_CHARACTER_HEARTS);
    }

    /**
     * Criteria for jumping on top of a chicken.
     * @param {MovableObject} enemy - The enemy object.
     * @returns {boolean} True if criteria met.
     */
    criteriaTopCollisionWithChicken(enemy) {
        return this.character.isCollidingTop(enemy) && (enemy instanceof Chicken || enemy instanceof ChickenSmall) && this.character.speedY < 0;
    }

    /**
     * Actions to perform when jumping on a chicken.
     * @param {number} i - The enemy index.
     * @param {number} currentTime - The current timestamp.
     * @returns {boolean} Returns true.
     */
    actionsTopCollisionWithChicken(i, currentTime) {
        this.character.jump(10);
        this.enemyManager.killChicken(i);
        this.lastJumpTime = currentTime;
        return true;
    }

    /**
     * Checks for throwing input and handles item usage.
     */
    checkThrowObjects() {
        if (this.keyboard.F && this.character.throwCooldown('one') && this.bottlesCollected > 0) {
            this.character.characterAttack('one');
        }
        if (this.keyboard.R && this.character.throwCooldown('two') && this.bottlesCollected > 0) {
            this.character.characterAttack('two');
        }
    }

    /**
     * Checks collisions for thrown bottles.
     */
    checkBottleCollisionAttackOneAndTwo() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            let bottle = this.throwableObjects[i];
            if (bottle instanceof ThrownBottle) {
                this.handleBottleEnemyCollision(bottle);
                this.evaluateBottleStatus(bottle, i);
            } else if (bottle instanceof SplashBottle && bottle.animationComplete) {
                this.throwableObjects.splice(i, 1);
            }
        }
    }

    /**
     * Evaluates the status of a thrown bottle and handles collisions.
     * @param {ThrownBottle} bottle - The thrown bottle.
     * @param {number} i - The bottle index.
     */
    evaluateBottleStatus(bottle, i) {
        if (bottle.attackType === 'two') {
            let traveledDistance = Math.abs(bottle.x - bottle.startX);
            let maxDistance = bottle.maxTravelDistance || 500;
            if (traveledDistance >= maxDistance) { bottle.hasCollided = true;}
        } else if (!bottle.hasCollided) {
            if (bottle.y >= 380) { bottle.hasCollided = true; }
            else if (Math.abs(bottle.x - this.character.x) > 720) { bottle.hasCollided = true; }
        }
        if (bottle.hasCollided) { this.turnThrownBottleToSplashBottle(bottle, i);}
    }

    /**
     * Handles collision detection between bottles and enemies.
     * @param {ThrownBottle} bottle - The bottle object.
     */
    handleBottleEnemyCollision(bottle) {
        if (!(bottle instanceof ThrownBottle) || bottle.hasCollided) { return; }
        let pierces = bottle.attackType === 'two';
        if (!bottle.enemiesHit) { bottle.enemiesHit = new Set(); }
        for (let j = this.level.enemies.length - 1; j >= 0; j--) {
            let enemy = this.level.enemies[j];
            if (!bottle.isColliding(enemy)) { continue; }
            let shouldStop = null;
            if (enemy instanceof Chicken || enemy instanceof ChickenSmall) { shouldStop = this.handleChickenHit(j, pierces);
            } else if (enemy instanceof Endboss) {shouldStop = this.handleEndbossHit(bottle, enemy, pierces);}
            if (shouldStop === null) { continue; }
            if (shouldStop) { bottle.hasCollided = true; break; }
        }
    }

    /**
     * Handles hitting a chicken.
     * @param {number} enemyIndex - The chicken index.
     * @param {boolean} pierces - If the weapon pierces.
     * @returns {boolean} True if the bottle should stop.
     */
    handleChickenHit(enemyIndex, pierces) {
        this.enemyManager.killChicken(enemyIndex);
        return !pierces;
    }

    /**
     * Handles hitting the endboss.
     * @param {ThrownBottle} bottle - The bottle.
     * @param {Endboss} enemy - The endboss object.
     * @param {boolean} pierces - If the weapon pierces.
     * @returns {boolean|null} True if bottle should stop, null if already hit this frame.
     */
    handleEndbossHit(bottle, enemy, pierces) {
        if (pierces && bottle.enemiesHit.has(enemy)) { return null; }
        enemy.hit();
        this.statusBarEndbossHealth.setPercentage(enemy.health, this.statusBarEndbossHealth.IMAGES_ENDBOSS_HEARTS);
        if (pierces) { bottle.enemiesHit.add(enemy); }
        return !pierces;
    }

    /**
     * Replaces a thrown bottle with a splash animation.
     * @param {ThrownBottle} bottle - The bottle object.
     * @param {number} i - The bottle index.
     */
    turnThrownBottleToSplashBottle(bottle, i) {
        this.throwableObjects.splice(i, 1);
        let splash = new SplashBottle(bottle.x, bottle.y, sounds);
        this.throwableObjects.push(splash);
    }
}