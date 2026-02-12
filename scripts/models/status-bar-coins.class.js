/**
 * Displays the coin collection status bar.
 * @extends DrawableObject
 */
class StatusBarCoins extends DrawableObject {

    IMAGES_COINS = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    percentage = 0;

    /**
     * Creates a new StatusBarCoins instance.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_COINS);
        this.setPercentage(0);
        this.x = 20;
        this.y = 40;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Updates the displayed percentage and image.
     * @param {number} percentage - The percentage to display.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES_COINS[this.resolveImageIndex()];
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
