class ThrowableObject extends MovableObject {


    constructor(x, y) {
        super();
        this.loadImage('../assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.hasLanded = false;
    }


}