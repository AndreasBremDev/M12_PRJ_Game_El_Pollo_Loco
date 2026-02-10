class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    endboss_left_end_x = 720 *3; /* 2160 */
    endboss_right_end_x = 720 * 5; /* 3600 */

    constructor(enemies, clouds, backgroundObjects, coins, bottles, sounds) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.sounds = sounds;
    }
}
