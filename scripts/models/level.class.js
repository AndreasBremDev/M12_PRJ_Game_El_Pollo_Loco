/**
 * Represents a game level containing all static and dynamic objects.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    endboss_left_end_x = 720 *3; /* 2160 */
    endboss_right_end_x = 720 * 5; /* 3600 */

    /**
     * Creates a new Level instance.
     * @param {MovableObject[]} enemies - Array of enemy objects.
     * @param {Cloud[]} clouds - Array of cloud objects.
     * @param {BackgroundObject[]} backgroundObjects - Array of background objects.
     * @param {Coins[]} coins - Array of coin objects.
     * @param {Bottles[]} bottles - Array of bottle objects.
     * @param {SoundManager} sounds - The sound manager instance.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles, sounds) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.sounds = sounds;
    }
}
