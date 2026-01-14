class StatusBarEndbossHealth extends DrawableObject {

    IMAGES_ENDBOSS_HEARTS = [
        'assets/img/7_statusbars/2_statusbar_endboss/green/green0_reverse.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green20_reverse.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green40_reverse.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green60_reverse.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green80_reverse.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green100_reverse.png'
    ];
    
    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSS_HEARTS);
        this.setPercentage(100);
        this.x = 490;
        this.y = -3;
        this.width = 200;
        this.height = 60;
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.IMAGES_ENDBOSS_HEARTS[this.resolveImageIndex()];
        this.img = this.imageCache[imagePath];
    }
    
    resolveImageIndex() {
        if (this.percentage == 100) {
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