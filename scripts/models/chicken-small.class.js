class ChickenSmall extends MovableObject {

    width = 50;
    height = 50;
    y = 380;
    health = 20;

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    offset = {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    };

    constructor(x) {
        super();
        this.x = x + Math.random() * 100;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
        this.speedX = 0.15 + Math.random() * 0.85;
        this.applyGravity();
        this.lastJumpTime = 0;
        this.nextJumpDelay = this.getRandomJumpDelay();

    }

    animate() {
        setInterval(() => {
            // this.moveLeft();
            this.checkRandomJump();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 100);
    }

    jump() {
        this.speedY = 20;
    }

    getRandomJumpDelay() {
        return 1000 + Math.random() * 1000;
    }

    checkRandomJump() {
        let currentTime = new Date().getTime();

        if (currentTime - this.lastJumpTime > this.nextJumpDelay) {
            this.jump();
            this.lastJumpTime = currentTime;
            this.nextJumpDelay = this.getRandomJumpDelay();
        }
    }
}
