class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    endboss_left_end_x = 1200;
    endboss_right_end_x = 2100;
    level_end_x = 720 * 5; // = 3600
    character_endboss_left_end_x = this.endboss_left_end_x - 110;


    constructor(enemies, clouds, backgroundObjects, coins, bottles, sounds) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.sounds = sounds;
    }
}
