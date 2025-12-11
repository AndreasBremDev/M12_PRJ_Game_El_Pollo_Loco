class MovableObject {
    // x = 200;
    y = 270;
    img;
    height = 50;
    width = 50;
    imageCache = [];
    currentImage = 0;
    speed = 1;
    otherDirection = false;

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

    moveRight(){
        console.log('moving right');
        
    }

    moveLeft() {
        
        
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}