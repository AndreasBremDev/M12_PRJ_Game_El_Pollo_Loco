class Coins extends MovableObject {

    width = 100;
    height = 100;

    IMAGES_COINS = [
        './assets/img/8_coin/coin_1.png',
        './assets/img/8_coin/coin_2.png'
    ];

    offset = { 
        top: 35,
        left: 35,
        right: 35,
        bottom: 35
    };

    constructor(x, y) {
        super();
        this.loadImage('./assets/img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.loadImages(this.IMAGES_COINS);
        this.animate();

    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 1000 / 10);
    }

}
