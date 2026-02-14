/**
 * Handles enemy lifecycle tasks such as killing enemies, playing death sounds,
 * and cleaning up enemy instances that should be removed from the world.
 */
class EnemyManager {
    /**
     * @param {World} world - Reference to the current world instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Removes a chicken enemy from the level and spawns its dead counterpart.
     * @param {number} enemyIndex - Index of the enemy inside level.enemies.
     */
    killChicken(enemyIndex) {
        const enemy = this.world.level.enemies[enemyIndex];
        if (!enemy) {
            return;
        }
        const deadSprite = new ChickenDead(enemy.x, enemy.y - 20, enemy);
        this.killedChickenPlaySounds(enemy);
        this.world.deadEnemies.push(deadSprite);
        this.world.level.enemies.splice(enemyIndex, 1);
    }

    /**
     * Plays the fitting death sound for the given enemy type.
     * @param {MovableObject} enemy - The defeated enemy instance.
     */
    killedChickenPlaySounds(enemy) {
        if (enemy instanceof Chicken) {
            this.world.sounds.playOnce(this.world.sounds.CHICKEN_DEAD);
        } else if (enemy instanceof ChickenSmall) {
            this.world.sounds.playOnce(this.world.sounds.CHICKEN_SMALL_DEAD);
        } else if (enemy instanceof Endboss) {
            this.world.sounds.playOnce(this.world.sounds.CHICKEN_ENDBOSS_DEAD);
        }
    }

    /**
     * Removes dead enemy sprites that have been visible long enough.
     */
    cleanupDeadEnemies() {
        const now = new Date().getTime();
        for (let i = this.world.deadEnemies.length - 1; i >= 0; i--) {
            const deadEnemy = this.world.deadEnemies[i];
            if (now - deadEnemy.createdTime > 1000) {
                this.world.deadEnemies.splice(i, 1);
            }
        }
    }

    /**
     * Deletes enemies that moved far offscreen so they no longer consume resources.
     */
    cleanupOffscreenEnemies() {
        for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.world.level.enemies[i];
            if (enemy instanceof Endboss) {
                continue;
            }
            if (enemy.x < -300 && enemy.x < this.world.character.x) {
                this.world.level.enemies.splice(i, 1);
            }
        }
    }
}
