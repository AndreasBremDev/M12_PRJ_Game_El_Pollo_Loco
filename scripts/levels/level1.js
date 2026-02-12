/**
 * Variable that stores the instance of the first level.
 * @type {Level}
 */
let level1;

/**
 * Initializes level 1 by creating all objects (enemies, clouds, background, coins, bottles).
 */
function initLevel() {

    let backgroundObjects = [];

    for (let i = -2; i < 6; i++) {
        let imageVariant = (i % 2 === 0) ? '2.png' : '1.png';
        backgroundObjects.push(
            new BackgroundObject(`./assets/img/5_background/layers/air.png`, 720 * i),
            new BackgroundObject(`./assets/img/5_background/layers/3_third_layer/${imageVariant}`, 720 * i),
            new BackgroundObject(`./assets/img/5_background/layers/2_second_layer/${imageVariant}`, 720 * i),
            new BackgroundObject(`./assets/img/5_background/layers/1_first_layer/${imageVariant}`, 720 * i)
        );
    }

    level1 = new Level(
        [
            new Chicken(400, sounds),
            new Chicken(450, sounds),
            new Chicken(480, sounds),
            new ChickenSmall(600, sounds),
            new Chicken(700, sounds),
            new Chicken(760, sounds),
            new Chicken(850, sounds),
            new ChickenSmall(900, sounds),
            new Chicken(1100, sounds),
            new Chicken(1200, sounds),
            new Chicken(1250, sounds),
            new ChickenSmall(1380, sounds),
            new Chicken(1450, sounds),
            new ChickenSmall(1480, sounds),
            new ChickenSmall(1580, sounds),
            new ChickenSmall(1640, sounds),
            new Chicken(1850, sounds),
            new ChickenSmall(1950, sounds),
            new Chicken(1980, sounds),
            new ChickenSmall(2090, sounds),
            new Chicken(2150, sounds),
            new ChickenSmall(2160, sounds),
            new Chicken(2200, sounds),

            new Endboss(720 * 4, sounds)
        ],
        [
            new Cloud()
        ],
        backgroundObjects,
        [
            new Coins(250, 300, sounds),
            new Coins(310, 210, sounds),
            new Coins(390, 170, sounds),
            new Coins(490, 150, sounds),
            new Coins(590, 170, sounds),
            new Coins(670, 210, sounds),
            new Coins(730, 300, sounds),

            new Coins(1100, 250, sounds),
            new Coins(1150, 250, sounds),
            new Coins(1100, 200, sounds),
            new Coins(1150, 200, sounds),

            new Coins(1300, 150, sounds),
            new Coins(1350, 150, sounds),
            new Coins(1300, 200, sounds),
            new Coins(1350, 200, sounds),

            new Coins(250 + 1200, 300, sounds),
            new Coins(310 + 1200, 210, sounds),
            new Coins(390 + 1200, 170, sounds),
            new Coins(490 + 1200, 150, sounds),
            new Coins(590 + 1200, 170, sounds),
            new Coins(670 + 1200, 210, sounds),
            new Coins(730 + 1200, 300, sounds),

        ],
        [
            new Bottles(0, 350, sounds),
            new Bottles(200, 350, sounds),
            new Bottles(250, 350, sounds),
            new Bottles(300, 350, sounds),
            new Bottles(350, 350, sounds),
            new Bottles(400, 350, sounds),
            new Bottles(450, 350, sounds),
            new Bottles(500, 350, sounds),
            new Bottles(550, 350, sounds),

            new Bottles(720, 350, sounds),
            new Bottles(920, 350, sounds),
            new Bottles(1020, 350, sounds),
            new Bottles(1120, 350, sounds),

            new Bottles(2900, 350, sounds),
            new Bottles(2950, 350, sounds),
            new Bottles(3000, 350, sounds),

            new Bottles(3400, 350, sounds),
            new Bottles(3500, 350, sounds),
        ]
    );
}