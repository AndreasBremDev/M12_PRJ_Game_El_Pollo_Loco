class ThrownBottle extends ThrowableObject {

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

    constructor(x, y, attackType = 'attackOne') {
        super(x, y);
        this.loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SQUEEZE);
        this.attackType = attackType;
        this.hasCollided = false;
        this.animate();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.attackType === 'attackOne') {
                this.playAnimation(this.IMAGES_ROTATE, 1);
            } else if (this.attackType === 'attackTwo') {
                this.playAnimation(this.IMAGES_SQUEEZE, 1);
            }
            if (this.hasCollided) {
                clearInterval(this.animationInterval);
            }
        }, 1000 / 25);
    }


}
