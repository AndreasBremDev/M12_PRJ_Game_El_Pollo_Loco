class Endboss extends MovableObject {
    y = 160;
    width = 210;
    height = 280;
    speedX = 8;
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
        this.hadFirstContact = false;
    }

    animate() {
        // let endbossMovements = setStoppableInterval(() => {
        //     if (this.hadFirstContact && this.x > 1200) {
        //         this.moveLeft();
        //     } else if (this.hadFirstContact && this.x == 1200 && this.x < 1800) {
        //         this.otherDirection = true;
        //         this.moveRight();
        //     }


        // }, 1000 / 60);

        let endbossAnimations = setStoppableInterval(() => {
            // if (!this.hadFirstContact) {

            // }


            if (this.isHurt() && this.health >= 20) {
                if (!this.animationCompleted) {
                    this.playAnimation(this.IMAGES_HURT, 6);
                } else if (this.animationCompleted) {
                    console.log('check hier - isHurt() & health >=20');
                    this.animationCompleted = false;
                    this.playAnimation(this.IMAGES_ATTACK, 7);
                }
            } else if (this.health < 20) {
                this.animationDeadAndEndGame();
            } else if (this.checkIfCharacterWithin(600) && !this.checkIfCharacterWithin(500) && this.hadFirstContact) {
                this.playAnimation(this.IMAGES_ALERT, 8);
            } else if (this.checkIfCharacterWithin(500)) {
                // this.moveLeft();
                this.playAnimation(this.IMAGES_ATTACK, 7);
            } else if (!this.hadFirstContact && this.x < 1800 && this.x > 1200) {
                // this.moveLeft();
                this.playAnimation(this.IMAGES_WALK);
            }
        }, 1000 / 60);
    }

    animationDeadAndEndGame() {
        if (!this.animationCompleted) {
            this.playAnimation(this.IMAGES_DEAD, 8, true, 3);
        } else {
            this.sounds.stop(this.sounds.BACKGROUND_GAME);
            this.sounds.stop(this.sounds.BACKGROUND_ENDBOSS);
            setTimeout(() => {
                endGame();
                this.sounds.playOnce(this.sounds.ENDGAME_WIN_2, 'music');
                showMenuTab('win');
            }, 250);
        }
    }


    checkIfCharacterWithin(distance) {
        return this.world.character.x + distance >= this.x;
    }

}
