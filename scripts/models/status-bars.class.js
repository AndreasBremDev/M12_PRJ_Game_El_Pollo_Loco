/**
 * Displays the status bars for character health, collected bottles, collected coins and endboss health.
 * @extends DrawableObject
 */
class StatusBars extends DrawableObject {

    IMAGES_BOTTLES = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
    ];

    IMAGES_COINS = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    IMAGES_ENDBOSS_HEARTS = [
        'assets/img/7_statusbars/2_statusbar_endboss/green/green0_reverse.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green20_reverse.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green40_reverse.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green60_reverse.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green80_reverse.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green100_reverse.png'
    ];

    IMAGES_CHARACTER_HEARTS = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    constructor(x, y, statusType) {
        super();
        this.x = x;
        this.y = y;
        if (statusType === 'bottles') {this.loadImages(this.IMAGES_BOTTLES); this.setPercentage(0, this.IMAGES_BOTTLES);
        } else if (statusType === 'coins') {this.loadImages(this.IMAGES_COINS); this.setPercentage(0, this.IMAGES_COINS);
        } else if (statusType === 'endboss') {this.loadImages(this.IMAGES_ENDBOSS_HEARTS); this.setPercentage(100, this.IMAGES_ENDBOSS_HEARTS);
        } else if (statusType === 'health') {this.loadImages(this.IMAGES_CHARACTER_HEARTS); this.setPercentage(100, this.IMAGES_CHARACTER_HEARTS);}
        this.width = 200;
        this.height = 60;
        this.percentage;
    }

    /**
     * Updates the displayed percentage and selects the matching image.
     * @param {number} percentage - The percentage to display.
     * @param {string[]} imagesArray - Array of status bar image paths.
     */
    setPercentage(percentage, imagesArray) {
        this.percentage = percentage;
        let imagePath = imagesArray[this.resolveImageIndex()];
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