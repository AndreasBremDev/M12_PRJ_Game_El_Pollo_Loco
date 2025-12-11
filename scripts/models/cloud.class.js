class Cloud extends MovableObject {
    y = 0;
    width = 720;
    height = 420;

    constructor() {
        super().loadImage('../assets/img/5_background/layers/4_clouds/1.png');
        this.x = 0 /* + Math.random() * 720 */;
        this.speed = 0.1;
        this.animate()
    }

    animate() {
        this.moveLeft();
    }



}