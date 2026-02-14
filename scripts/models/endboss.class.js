/**
 * Represents the endboss enemy with multi-phase behavior.
 * @extends MovableObject
 */
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

    /**
     * Creates a new Endboss instance.
     * @param {number} x - The x-coordinate where the endboss starts.
     * @param {Sounds} sounds - The sound manager instance.
     */
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
        this.phaseStarted = false;
        this.waitingStartTime = 0;
    }

    /**
     * Runs the main endboss animation and behavior loop.
     */
    animate() {
        let endbossAnimations = setStoppableInterval(() => {
            this.updateHurtStatus();
            (this.health < 20 || this.currentPhase === 'dead') && this.animationDeadAndEndGame(); 
            (this.isHurt()) && this.playAnimation(this.IMAGES_HURT, 6);
            this.actionsWhenHurtIsOver();
            if (this.currentPhase === 'alert') {this.handlePhaseAlert();
            } else if (this.currentPhase === 'attackOne') {this.handlePhaseAttackOne();
            } else if (this.currentPhase === 'attackTwo') {this.handlePhaseAttackTwo();
            } else if (this.currentPhase === 'attackThree') {this.handlePhaseAttackThree();
            } else if (this.currentPhase === 'withdraw') {this.handleWithdrawPhase();}
        }, 1000 / 60);
    }
    
    /**
     * Handles the third attack phase with jumping and aggressive movement.
     * Jumps, moves left, and plays attack animation if not hurt.
     */
    handlePhaseAttackThree() {
        if (!this.isAboveGround()) { this.jump(25); }
        this.moveLeft(7);
        if (!this.isHurt()) { this.playAnimation(this.IMAGES_ATTACK, 8); }
        this.actionWhenAtEndbossLeftPosition();
    }

    /**
     * Handles the alert phase where the endboss waits before withdrawing.
     * Plays alert animation and checks if the waiting period has elapsed.
     */
    handlePhaseAlert() {
        if (!this.isHurt()) { 
            this.playAnimation(this.IMAGES_ALERT, 16); 
        }
        this.checkIfWaitingPeriodIsOver('withdraw');
    }
    
    /**
     * Handles the first attack phase with slow movement.
     * Moves left and plays walking animation if not hurt.
     */
    handlePhaseAttackOne() {
        this.moveLeft(3);
        if (!this.isHurt()) { this.playAnimation(this.IMAGES_WALK, 8); }
        this.actionWhenAtEndbossLeftPosition();
    }
    
    /**
     * Handles the second attack phase with faster movement.
     * Moves left and plays attack animation if not hurt.
     */
    handlePhaseAttackTwo() {
        this.moveLeft(7);
        if (!this.isHurt()) { this.playAnimation(this.IMAGES_ATTACK, 8); }
        this.actionWhenAtEndbossLeftPosition();
    }

    /**
     * Updates the hurt state timer for the endboss.
     */
    updateHurtStatus() {
        let timePassed = new Date().getTime() - this.lastHit;
        let cooldown = (this instanceof Character) ? this.characterIsHurtTimeOffset : this.endbossIsHurtTimeOffset;

        if (this.isCurrentlyHurt && timePassed > cooldown) {
            this.isCurrentlyHurt = false;
        }
    }

    /**
     * Handles phase switching after a hurt state ends.
     */
    actionsWhenHurtIsOver() {
        if (!this.isHurt() && this.endbossHurtProcessed) {
            this.endbossHurtProcessed = false;
            this.endbossHitCounter++;
            if (this.endbossHitCounter >= 5 || this.health < 20) {this.switchPhase('dead'); }
            else if (this.endbossHitCounter === 1) { this.switchPhase('attackOne'); }
            else if (this.endbossHitCounter === 2) { this.switchPhase('attackTwo'); }
            else if (this.endbossHitCounter === 3) { this.switchPhase('attackThree'); }
            else if (this.endbossHitCounter === 4) { this.switchPhase('attackTwo'); }
            else { this.switchPhase('attackTwo'); }
        }
    }

    /**
     * Switches to alert phase after reaching the left boundary.
     */
    actionWhenAtEndbossLeftPosition() {
        if (this.x < this.world.level.endboss_left_end_x) {
            this.switchPhase('alert');
            this.waitingStartTime = new Date().getTime();
        }
    }

    /**
     * Advances to the next phase after a short waiting period.
     * @param {string} nextPhase - The phase to switch to.
     */
    checkIfWaitingPeriodIsOver(nextPhase) {
        if (this.waitingStartTime && new Date().getTime() - this.waitingStartTime > 250) {
            this.waitingStartTime = 0;
            this.switchPhase(nextPhase);
        }
    }

    /**
     * Switches the endboss to a new phase and resets animation state.
     * @param {string} newPhase - The phase to switch to.
     */
    switchPhase(newPhase) {
        if (this.currentPhase === newPhase) return;
        this.currentPhase = newPhase
        this.phaseStarted = false;
        this.animationStarted = false;
        this.animationCompleted = false;
        this.currentImage = 0;
        this.animationCounter = 0;
    }

    /**
     * Handles movement and transitions while withdrawing to the right.
     */
    handleWithdrawPhase() {
        if (!this.phaseStarted) {
            if (this.endbossHitCounter !== 3) {
                this.jump(25);
            }
            this.phaseStarted = true;
        }
        if (!this.isHurt()) { this.playAnimation(this.IMAGES_WALK, 8); }
        this.moveRight(5);
        if (this.x >= this.world.level.endboss_right_end_x) {
            this.x = this.world.level.endboss_right_end_x;
            if (this.endbossHitCounter === 3) { this.switchPhase('attackThree'); }
            else if (this.endbossHitCounter === 4) { this.switchPhase('attackTwo'); }
            else { this.switchPhase('alert') }
        }
    }

    /**
     * Plays the death animation and finishes the game.
     */
    animationDeadAndEndGame() {
        this.currentPhase = 'dead';
        if (!this.animationCompleted) {
            this.playAnimation(this.IMAGES_DEAD, 12, true, 3);
        } else {
            finishGame('win');
        }
        return;
    }

}

