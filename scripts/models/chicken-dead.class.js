class ChickenDead extends MovableObject {

    width = 50;
    height = 50;
    health = 20;

    CHICKEN_NORMAL_DEAD = [
        './assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    CHICKEN_SMALL_DEAD = [
        './assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    offset = {
        top: 25,
        left: 0,
        right: 0,
        bottom: 5
    };

    constructor(x, y, chickenType) {
        super();
        this.x = x;
        this.y = y;
        this.applyGravity();
        if (chickenType instanceof ChickenSmall) {
            this.loadImage(this.CHICKEN_SMALL_DEAD[0]);
        } else {
            this.loadImage(this.CHICKEN_NORMAL_DEAD[0]);
        } 
        this.createdTime = new Date().getTime(); // Zeitstempel für automatisches Entfernen
    }
}
