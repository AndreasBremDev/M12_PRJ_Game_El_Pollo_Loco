class MovableObject {
    // x = 200;
    y = 270;
    img;
    imageCache = [];
    currentImage = 0;
    speedX = 1;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;



    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = 235;
                this.speedY = 0;
            };
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 235;
    }

    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src="...">;
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
        ctx.beginPath();
        ctx.lineWidth = '1';
        this instanceof Character ? ctx.strokeStyle = 'blue' : ctx.strokeStyle = 'red';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        }
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speedX;
    }

    moveLeft() {
        this.x -= this.speedX;
    }




}