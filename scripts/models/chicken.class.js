class Chicken extends MovableObject {
    y = 380;
    IMAGES_WALKING = [
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ]
    

    constructor() {
        super();
        this.loadImage('../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 400 + Math.random() * 320; // Zufällige x-Position zwischen 400 und 720
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
        this.speed = 0.15 + Math.random() * 0.25; // Zufällige Geschwindigkeit zwischen 0.1 und 0.4
    
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = this.IMAGES_WALKING[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }, 100);
    }
    eat() {
        console.log("The chicken is eating!");
    }
}