class ThrowableObject extends MovableObject {


    constructor(x, y) {
        super();
        this.loadImage('../assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.throw();
    }
    throw() {
        this.speedX = 15;
        this.speedY = 20;
        this.applyGravity();
        setInterval(() => {
            this.x += this.speedX;
        }, 1000 / 25);
    };
    


}