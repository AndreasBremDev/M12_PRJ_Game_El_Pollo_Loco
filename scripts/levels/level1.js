let level1;

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
            // new Chicken(400, sounds),
            // new Chicken(400, sounds),
            // new Chicken(400, sounds),
            // new ChickenSmall(600, sounds),
            // new Chicken(800, sounds),
            // new Chicken(800, sounds),
            // new Chicken(800, sounds),
            // new ChickenSmall(900, sounds),
            // new Chicken(1200, sounds),
            // new Chicken(1200, sounds),
            // new Chicken(1200, sounds),
            // new ChickenSmall(1300, sounds),

            new Endboss(1200, sounds)
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
            new Coins(1150, 200, sounds)

        ],
        [
            new Bottles(0, 350, sounds),
            new Bottles(200, 350, sounds),
            new Bottles(300, 350, sounds),
            new Bottles(400, 350, sounds),

            new Bottles(720, 350, sounds),
            new Bottles(920, 350, sounds),
            new Bottles(1020, 350, sounds),
            new Bottles(1120, 350, sounds),
        ]
    );
}