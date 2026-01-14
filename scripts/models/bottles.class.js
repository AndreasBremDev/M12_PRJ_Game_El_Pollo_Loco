class Bottles extends MovableObject {

    width = 80;
    height = 80;

    IMAGES_BOTTLE_A = [
        './assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ];
    IMAGES_BOTTLE_B = [
        './assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    offset = { 
        top: 15,
        left: 25,
        right: 25,
        bottom: 8
    };

    constructor(x, y) {
        super();
        this.loadImage('./assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImage('./assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;

    }

}