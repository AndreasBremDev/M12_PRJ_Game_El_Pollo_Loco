/**
 * Displays the bottle collection status bar.
 * @extends DrawableObject
 */
class StatusBarBottles extends DrawableObject {

    IMAGES_BOTTLES = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

    percentage = 0;

    /**
     * Creates a new StatusBarBottles instance.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_BOTTLES);
        this.setPercentage(0);
        this.x = 20;
        this.y = 90;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Updates the displayed percentage and image.
     * @param {number} percentage - The percentage to display.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES_BOTTLES[this.resolveImageIndex()];
        this.img = this.imageCache[imagePath];
    }
    
    /**
     * Resolves the image index based on the current percentage.
     * @returns {number} The index of the image to use.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
