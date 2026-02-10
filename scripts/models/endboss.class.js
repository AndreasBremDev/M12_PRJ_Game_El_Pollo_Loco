class Endboss extends MovableObject {
    y = 160;
    width = 210;
    height = 280;
    speedY = 20;

    IMAGES_ALERT = [
        './assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_WALK = [
        './assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        './assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        './assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        './assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        './assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        './assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    offset = {
        top: 55,
        left: 35,
        right: 30,
        bottom: 15
    };

    constructor(x, sounds) {
        super();
        this.sounds = sounds;
        this.loadImage('./assets/img/4_enemie_boss_chicken/2_alert/G5.png');
        this.x = x;
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.applyGravity();
        this.endbossHitCounter = 0;
        this.currentPhase = 'alert';
        this.phaseStarted = false;
    }

    animate() {
        let endbossAnimations = setStoppableInterval(() => {
            if (this.health < 20 || this.currentPhase === 'dead') {
                this.animationDeadAndEndGame();
                return;
            }
            if (this.currentPhase === 'alert') {
                this.playAnimation(this.IMAGES_ALERT, 16);
                if (this.isHurt()) this.switchPhase('hurt');
            }
            else if (this.currentPhase === 'hurt') {
                this.playAnimation(this.IMAGES_HURT, 6);
                this.actionsWhenHurtIsOver();
            }
            else if (this.currentPhase === 'attackOne') {
                this.playAnimation(this.IMAGES_WALK, 8);
                this.moveLeft(3);
                if (this.isHurt()) this.switchPhase('hurt');
                this.actionWhenAtEndbossLeftPosition();
            }
            else if (this.currentPhase === 'attackTwo') {
                this.playAnimation(this.IMAGES_ATTACK, 8);
                this.moveLeft(7);
                if (this.isHurt()) this.switchPhase('hurt');
                this.actionWhenAtEndbossLeftPosition();
            }
            else if (this.currentPhase === 'attackThree') {
                if (!this.isAboveGround()) {
                    this.jump(25);
                }
                this.playAnimation(this.IMAGES_ATTACK, 8);
                this.moveLeft(7);
                if (this.isHurt()) this.switchPhase('hurt');
                this.actionWhenAtEndbossLeftPosition();
            }
            else if (this.currentPhase === 'withdraw') {
                this.handleWithdrawPhase();
            }
        }, 1000 / 60);
    }

    actionsWhenHurtIsOver() {
        if (!this.isHurt()) {
            this.endbossHitCounter++;
            if (this.endbossHitCounter >= 5 || this.health < 20) {
                this.switchPhase('dead');
            }
            else if (this.endbossHitCounter === 1) { this.switchPhase('attackOne'); }
            else if (this.endbossHitCounter === 2) { this.switchPhase('attackTwo'); }
            else if (this.endbossHitCounter === 3) { this.switchPhase('attackThree'); }
            else if (this.endbossHitCounter === 4) { this.switchPhase('attackTwo'); }
            else { this.switchPhase('attackOne'); }
        }
    }

    actionWhenAtEndbossLeftPosition() {
        if (this.x < this.world.level.endboss_left_end_x) {
            this.switchPhase('alert');
            setTimeout(() => {
                this.switchPhase('withdraw');
            }, 500);
        }
    }

    switchPhase(newPhase) {
        this.currentPhase = newPhase;
        this.phaseStarted = false;
    }

    handleWithdrawPhase() {
        if (!this.phaseStarted && !(this.endbossHitCounter === 3)) {
            this.jump(25);
            this.phaseStarted = true;
        }
        this.playAnimation(this.IMAGES_WALK, 8);
        this.moveRight(5);
        if (this.x >= this.world.level.endboss_right_end_x) {
            this.x = this.world.level.endboss_right_end_x;
            if (this.endbossHitCounter === 3) { this.switchPhase('attackThree'); }
            else if (this.endbossHitCounter === 4) { this.switchPhase('attackTwo'); }
            else { this.switchPhase('alert') }
        }
    }

    animationDeadAndEndGame() {
        this.currentPhase = 'dead';
        if (!this.animationCompleted) {
            this.playAnimation(this.IMAGES_DEAD, 12, true, 3);
        } else {
            this.stopRepeatableSounds();
            setTimeout(() => {
                endGame();
                this.sounds.playOnce(this.sounds.ENDGAME_WIN, 'effect');
                showMenuTab('win');
            }, 250);
        }
    }



}

