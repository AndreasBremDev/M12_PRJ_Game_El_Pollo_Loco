class Bottle extends ThrowableObject {

    IMAGES_ROTATE = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SQUEEZE = [
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_squeeze/1_bottle_squeeze1.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_squeeze/2_bottle_squeeze2.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_squeeze/3_bottle_squeeze3.png',
    ];

    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    constructor(x, y, keyboard) {
        super(x, y);
        this.loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');
        this.keyboard = keyboard;
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SQUEEZE);
        this.loadImages(this.IMAGES_SPLASH);
        this.hasSplashed = false;
        this.splashFrameCount = 0;
        this.animate();
        this.attackOne();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.y < 380 && !this.hasSplashed) {
                this.playAnimation(this.IMAGES_ROTATE, 1);
            } else if (!(this.y < 380) && !this.hasSplashed) {
                this.speedX = 0; // Bewegung stoppen
                this.speedY = 0; // Keine weitere Gravitation
                this.playAnimation(this.IMAGES_SPLASH, 4);
                this.splashFrameCount++;
                
                // BUG: splash/Bottle fällt (y wieder <> 0) nach Splash-Animation 
                // BUG: bottle wird nicht aus level gespliced nach splash-Animation

                // Nach vollständiger Splash-Animation stoppen
                if (this.splashFrameCount >= this.IMAGES_SPLASH.length * 4) {
                    this.hasSplashed = true;
                    this.splashAnimationComplete = true;
                    clearInterval(this.animationInterval); // Animation komplett stoppen
                    
                }
            }
        }, 1000 / 25);
    }

    attackOne() {
        this.speedX = 15;
        this.speedY = 20;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (!this.hasSplashed) {
                this.x += this.speedX;
            } else {
                clearInterval(this.throwInterval);
            }
        }, 1000 / 25);
    }

}