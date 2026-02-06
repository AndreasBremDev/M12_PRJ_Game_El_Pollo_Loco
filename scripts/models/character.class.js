class Character extends MovableObject {
    x = 100;
    y = 235;
    height = 200;
    width = 100;
    speedX = 8;
    crouching = false;
    endbossMaxLeft = 1200;
    world;

    offset = {
        top: 90,
        left: 30,
        right: 25,
        bottom: 10
    };


    IMAGES_WALKING = [
        './assets/img/2_character_pepe/2_walk/W-21.png',
        './assets/img/2_character_pepe/2_walk/W-22.png',
        './assets/img/2_character_pepe/2_walk/W-23.png',
        './assets/img/2_character_pepe/2_walk/W-24.png',
        './assets/img/2_character_pepe/2_walk/W-25.png',
        './assets/img/2_character_pepe/2_walk/W-26.png'
    ];



    IMAGES_IDLE = [
        './assets/img/2_character_pepe/1_idle/idle/I-1.png',
        './assets/img/2_character_pepe/1_idle/idle/I-3.png',
        './assets/img/2_character_pepe/1_idle/idle/I-2.png',
        './assets/img/2_character_pepe/1_idle/idle/I-4.png',
        './assets/img/2_character_pepe/1_idle/idle/I-5.png',
        './assets/img/2_character_pepe/1_idle/idle/I-6.png',
        './assets/img/2_character_pepe/1_idle/idle/I-7.png',
        './assets/img/2_character_pepe/1_idle/idle/I-8.png',
        './assets/img/2_character_pepe/1_idle/idle/I-9.png',
        './assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        './assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ]

    IMAGES_JUMPING = [
        './assets/img/2_character_pepe/3_jump/J-31.png',
        './assets/img/2_character_pepe/3_jump/J-32.png',
        './assets/img/2_character_pepe/3_jump/J-33.png',
        './assets/img/2_character_pepe/3_jump/J-34.png',
        './assets/img/2_character_pepe/3_jump/J-35.png',
        './assets/img/2_character_pepe/3_jump/J-36.png',
        './assets/img/2_character_pepe/3_jump/J-37.png',
        './assets/img/2_character_pepe/3_jump/J-38.png',
        './assets/img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURT = [
        './assets/img/2_character_pepe/4_hurt/H-41.png',
        './assets/img/2_character_pepe/4_hurt/H-42.png',
        './assets/img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        './assets/img/2_character_pepe/5_dead/D-51.png',
        './assets/img/2_character_pepe/5_dead/D-52.png',
        './assets/img/2_character_pepe/5_dead/D-53.png',
        './assets/img/2_character_pepe/5_dead/D-54.png',
        './assets/img/2_character_pepe/5_dead/D-55.png',
        './assets/img/2_character_pepe/5_dead/D-56.png',
        './assets/img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_CROUCH = [
        './assets/img/2_character_pepe/5_crouch/C-1.png'
    ]

    IMAGES_CROUCHING = [
        './assets/img/2_character_pepe/5_crouch/C-2.png',
        './assets/img/2_character_pepe/5_crouch/C-3.png',
        './assets/img/2_character_pepe/5_crouch/C-4.png',
        './assets/img/2_character_pepe/5_crouch/C-1.png'
    ];


    constructor(sounds) {
        super();
        this.sounds = sounds;
        this.loadImage('./assets/img/2_character_pepe/2_walk/W-21.png');
        this.loadImage('./assets/img/2_character_pepe/5_crouch/C-1.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_CROUCH);
        this.loadImages(this.IMAGES_CROUCHING);
        this.applyGravity();
        this.animate();
    }

    animate() {

        let characterSounds = setStoppableInterval(() => {
            this.sounds.pause(this.sounds.CHARACTER_WALK);
            this.sounds.pause(this.sounds.CHARACTER_CROUCHING);
            if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && this.world.cameraInterpolationCompleted && !this.isAboveGround() && !this.world.keyboard.DOWN) {
                this.sounds.playLoop(this.sounds.CHARACTER_WALK);
            } else if (this.world.keyboard.DOWN && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                this.sounds.playLoop(this.sounds.CHARACTER_CROUCHING);
            }
        }, 1000 / 60);

        let characterMovements = setStoppableInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.enemies.find(enemy => enemy instanceof Endboss).x + this.width && this.world.cameraInterpolationCompleted) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0 && this.world.cameraInterpolationCompleted) {
                this.moveLeft();
                this.otherDirection = true;
            }
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump(30);
                this.sounds.playOnce(this.sounds.CHARACTER_JUMP);
            }
            this.world.keyboard.DOWN ? this.crouching = true : this.crouching = false;
            if (this.world.endboss.x - this.x < 600 && !this.world.endboss.hadFirstContact) {
                this.sounds.pause(this.sounds.BACKGROUND_GAME);
                this.sounds.playLoop(this.sounds.BACKGROUND_ENDBOSS, 'music');
                this.sounds.playOnce(this.sounds.CHICKEN_ENDBOSS_ATTACK);
                this.world.endboss.hadFirstContact = true;
            } else {
                this.sounds.pause(this.sounds.BACKGROUND_ENDBOSS, 'music');
                this.sounds.playLoop(this.sounds.BACKGROUND_GAME, 'music');
            }

        }, 1000 / 60);

        let characterAnimations = setStoppableInterval(() => {
            if (this.isDead()) {
                this.animationDeadAndEndGame();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT, 1);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.world.keyboard.DOWN) {
                this.animationWalkingOrIdle();
            } else if (this.world.keyboard.DOWN && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                this.animationCrouchingOrCrouch();
            } else if (this.world.keyboard.DOWN) {
                this.playAnimation(this.IMAGES_CROUCH);
            } else if (this.isIdle('long')) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
            } else if (this.isIdle('short')) {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 1000 / 25);
    }

    animationDeadAndEndGame() {
        window.removeKeyboardListeners();
        window.removeTouchListeners();
        if (!this.animationCompleted) {
            this.playAnimation(this.IMAGES_DEAD, 3, true);
        } else {
            setTimeout(() => {
                endGame();
                this.sounds.playOnce(this.sounds.ENDGAME_LOOSE, 'music');
                showMenuTab('gameover');
            }, 500);
        }
    }

    animationCrouchingOrCrouch() {
        if (this.world.keyboard.RIGHT && this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_CROUCH);
        } else {
            this.playAnimation(this.IMAGES_CROUCHING, 2);
        }
    }

    animationWalkingOrIdle() {
        if (this.world.keyboard.RIGHT && this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    characterAttack(attackType) {
        this.world.lastThrowTime = new Date().getTime();
        let bottle = this.checkAttackType(attackType)
        // this.otherDirection === false ? new ThrownBottle(this.x + 50, this.y + 100, attackType) : new ThrownBottle(this.x, this.y + 100, attackType);

        attackType === 'one' ? this.attackOne(bottle) : this.attackTwo(bottle);
        this.world.throwableObjects.push(bottle);
        this.world.bottlesCollected -= 20;
        this.world.statusBarBottles.setPercentage(this.world.bottlesCollected);
    }

    checkAttackType(attackType) {
        if ((attackType === 'one' || attackType === 'two') && this.otherDirection === false && this.crouching === false) {
            return new ThrownBottle(this.x + 50, this.y + 100, attackType);
        } else if ((attackType === 'one' || attackType === 'two') && this.otherDirection === false && this.crouching === true) {
            return new ThrownBottle(this.x + 50, this.y + 130, attackType);
        } else if ((attackType === 'one' || attackType === 'two') && this.otherDirection === true && this.crouching === false) {
            return new ThrownBottle(this.x, this.y + 100, attackType);
        } else if ((attackType === 'one' || attackType === 'two') && this.otherDirection === true && this.crouching === true) {
            return new ThrownBottle(this.x, this.y + 130, attackType);
        }
    }

    attackOne(throwableObject) {
        throwableObject.applyGravity();
        throwableObject.speedY = 20;
        this.otherDirection === false ? throwableObject.speedX = 15 : throwableObject.speedX = -15;
        this.attackOneInterval = setStoppableInterval(() => {
            if (!throwableObject.hasCollided) {
                throwableObject.x += throwableObject.speedX;
            } else {
                throwableObject.speedX = 0;
                clearInterval(this.attackOneInterval);
            }
        }, 1000 / 25);
    }

    attackTwo(throwableObject) {
        this.otherDirection === false ? throwableObject.speedX = 15 : throwableObject.speedX = -15;
        this.attackTwoInterval = setStoppableInterval(() => {
            if (!throwableObject.hasCollided) {
                throwableObject.x += throwableObject.speedX;
            } else {
                throwableObject.speedX = 0;
                clearInterval(this.attackTwoInterval);
            }
        }, 1000 / 25);
    }

    throwCooldown(attackType) {
        let currentTime = new Date().getTime();
        if (attackType === 'one') {
            return currentTime - this.world.lastThrowTime >= this.world.attackOneCooldown;
        } else {
            return currentTime - this.world.lastThrowTime >= this.world.attackTwoCooldown;
        }
    }





}
