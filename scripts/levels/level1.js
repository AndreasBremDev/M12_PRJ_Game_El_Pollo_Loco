let level1;

// when press START (or else) call function initLevel

function initLevel() {

    let backgroundObjects = [];

    for (let i = -2; i < 4; i++) {
        let imageVariant = (i % 2 === 0) ? '2.png' : '1.png';
        backgroundObjects.push(
            new BackgroundObject(`../assets/img/5_background/layers/air.png`, 720 * i),
            new BackgroundObject(`../assets/img/5_background/layers/3_third_layer/${imageVariant}`, 720 * i),
            new BackgroundObject(`../assets/img/5_background/layers/2_second_layer/${imageVariant}`, 720 * i),
            new BackgroundObject(`../assets/img/5_background/layers/1_first_layer/${imageVariant}`, 720 * i)
        );
    }

    level1 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            // new Chicken(),
            // new Chicken(),
            // new Chicken(),
            // new Chicken(),
            // new Chicken(),
            // new Chicken(),


            new Endboss()
        ],
        [
            new Cloud()
        ],
        backgroundObjects
    );
}