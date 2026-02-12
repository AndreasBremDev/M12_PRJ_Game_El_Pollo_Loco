/**
 * Base class for all objects that can be drawn on the canvas.
 */
class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    y = 270;
    width = 100;
    height = 100;


    /**
     * Loads a single image.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        if (IMAGE_CACHE[path]) {
            this.img = IMAGE_CACHE[path];
        } else {
            this.img = new Image();
            this.img.src = path;
        }
    }

    /**
     * Loads multiple images into the image cache.
     * @param {string[]} arr - Array of paths to image files.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            if (IMAGE_CACHE[path]) {
                this.imageCache[path] = IMAGE_CACHE[path];
            } else {
                let img = new Image();
                img.src = path;
                this.imageCache[path] = img;
            }
        });
    }

    /**
     * Draws the object on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Draws a frame around the object for debugging collision boxes.
     * only needed for debugging purposes, to be inserted after mo.draw(this.ctx);
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character ||
            this instanceof Chicken ||
            this instanceof Endboss ||
            this instanceof ThrowableObject ||
            this instanceof Coins ||
            this instanceof Bottles ||
            this instanceof ChickenDead ||
            this instanceof ChickenSmall) {
            ctx.beginPath();
            ctx.lineWidth = '1';
            if (this instanceof Bottles) { ctx.strokeStyle = 'purple' };
            if (this instanceof Coins) { ctx.strokeStyle = 'yellow' };
            if (this instanceof Character) { ctx.strokeStyle = 'blue' };
            if (this instanceof Chicken) { ctx.strokeStyle = 'red' };
            if (this instanceof ChickenSmall) { ctx.strokeStyle = 'darkred' };
            if (this instanceof Endboss) { ctx.strokeStyle = 'green' };
            if (this instanceof ThrowableObject) { ctx.strokeStyle = 'orange' };
            if (this instanceof ChickenDead) { ctx.strokeStyle = 'white' };
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
            ctx.stroke();
        }
    }
}
