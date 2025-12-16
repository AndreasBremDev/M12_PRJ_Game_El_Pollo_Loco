class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    // x = 200;
    y = 270;
    width = 100;
    height = 100;


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
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '1';
            if (this instanceof Character) { ctx.strokeStyle = 'blue' };
            if (this instanceof Chicken) { ctx.strokeStyle = 'red' };
            if (this instanceof Endboss) { ctx.strokeStyle = 'green' };
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
            ctx.stroke();
        }
    }
}
