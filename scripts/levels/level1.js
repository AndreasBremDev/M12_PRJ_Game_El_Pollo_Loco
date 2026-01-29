let level1;

function initLevel() {

    let backgroundObjects = [];

    for (let i = -2; i < 4; i++) {
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
            // new Chicken(400),
            // new Chicken(400),
            // new Chicken(400),
            // new ChickenSmall(600),
            // new Chicken(800),
            // new Chicken(800),
            // new Chicken(800),
            // new ChickenSmall(900),
            // new Chicken(1200),
            // new Chicken(1200),
            // new Chicken(1200),
            // new ChickenSmall(1300),


            new Endboss()
        ],
        [
            new Cloud()
        ],
        backgroundObjects,
        [
            new Coins(250, 300),
            new Coins(310, 210),
            new Coins(390, 170),
            new Coins(490, 150),
            new Coins(590, 170),
            new Coins(670, 210),
            new Coins(730, 300),

            new Coins(1100, 250),
            new Coins(1150, 250),
            new Coins(1100, 200),
            new Coins(1150, 200)

        ],
        [
            new Bottles(0, 350),
            new Bottles(200, 350),
            new Bottles(300, 350),
            new Bottles(400, 350),

            new Bottles(720, 350),
            new Bottles(920, 350),
            new Bottles(1020, 350),
            new Bottles(1120, 350),
        ]
    );
}