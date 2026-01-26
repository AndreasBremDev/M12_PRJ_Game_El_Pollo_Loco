class Character extends MovableObject {
    x = 100;
    y = 235;
    height = 200;
    width = 100;
    speedX = 8;

    currentImage = 0;
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

    currentStatus = 'idle';
    nextStatus = '';
    currStatusChanged = false;

    constructor() {
        super();
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

        setInterval(() => {
            // this.walking_sound.pause();
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                // this.walking_sound.play();
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                // this.walking_sound.play();
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                // this.jump_sound.play();
            }

            this.world.camera_x = -this.x + 100;

        }, 1000 / 60);

        setInterval(() => {
            if (this.currentStatus !== this.nextStatus) {
                this.resetAnimation();
            }
            this.currentStatus = this.nextStatus;
            if (this.isDead()) {
                if (!this.animationCompleted) { // ← Nur wenn noch nicht abgeschlossen
                    this.playAnimation(this.IMAGES_DEAD, 3, true);
                }
                this.nextStatus = 'dead';
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT, 1);
                this.nextStatus = 'hurt';
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
                this.nextStatus = 'jumping';
            } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.world.keyboard.DOWN) {
                this.playAnimation(this.IMAGES_WALKING);
                this.nextStatus = 'walking';
            }else if (this.world.keyboard.DOWN && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                this.playAnimation(this.IMAGES_CROUCHING, 2);
                this.nextStatus = 'crouching';
            } else if (this.world.keyboard.DOWN) {
                this.playAnimation(this.IMAGES_CROUCH);
                this.nextStatus = 'crouch';
            } else if (this.isIdle('long')) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
                this.nextStatus = 'longIdle';
            } else {
                this.playAnimation(this.IMAGES_IDLE);
                this.nextStatus = 'idle';
            }
        }, 1000 / 25);
    }

    jump(speedY = 30) {
        this.speedY = speedY;
    }

    resetAnimation() {
        this.currentImage = 0;
    }

    characterAttack(attackType) {
        this.world.lastThrowTime = new Date().getTime();
        let bottle = new ThrownBottle(this.x + 50, this.y + 100, attackType);
        attackType === 'one' ? this.attackOne(bottle) : this.attackTwo(bottle);
        this.world.throwableObjects.push(bottle);
        this.world.bottlesCollected -= 20;
        this.world.statusBarBottles.setPercentage(this.world.bottlesCollected);
    }

    attackOne(throwableObject) {
        throwableObject.speedX = 15;
        throwableObject.speedY = 20;
        throwableObject.applyGravity();
        this.throwInterval = setInterval(() => {
            if (!throwableObject.hasCollided) {
                throwableObject.x += throwableObject.speedX;
            } else {
                throwableObject.speedX = 0;
                clearInterval(this.throwInterval);
            }
        }, 1000 / 25);
    }

    attackTwo(throwableObject) {
        throwableObject.speedX = 15;
        this.throwInterval = setInterval(() => {
            if (!throwableObject.hasCollided) {
                throwableObject.x += throwableObject.speedX;
            } else {
                throwableObject.speedX = 0;
                clearInterval(this.throwInterval);
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
