class SplashBottle extends ThrowableObject {

    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    constructor(x, y) {
        super(x, y);
        this.loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_SPLASH);
        this.splashFrameCount = 0;
        this.animationComplete = false;
        this.animate();
    }

    animate() {
        this.bottleSplashAnimation = setStoppableInterval(() => {
            this.playAnimation(this.IMAGES_SPLASH, 4);
            this.splashFrameCount++;
            if (this.splashFrameCount >= this.IMAGES_SPLASH.length * 4) {
                this.animationComplete = true;
                clearInterval(this.animationInterval);
            }
        }, 1000 / 25);
    }


}
