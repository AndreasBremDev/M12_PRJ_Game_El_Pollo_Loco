let titleBg = 'url("./assets/img/9_intro_outro_screens/start/startscreen_1.png")';
let menuBg = 'url("./assets/img/5_background/second_half_background.png")';
let topSection = document.getElementById('topSection');
let midSection = document.getElementById('middleSection');
let bottomSection = document.getElementById('bottomSection');
const progressEffectFill = document.getElementById('volumeEffectProgress');
const progressMusicFill = document.getElementById('volumeMusicProgress');
let controlOverlay = document.getElementById('canvasControl');
let showCanvasControlsIsActive = false;
let loadingSpinnerImagesTotal = 0;
let loadingSpinnerImagesLoaded = 0;
let IMAGE_CACHE = {};
let isPreloadFinished = false;
const preloadImages = [
    './assets/img/5_background/layers/air.png',
    './assets/img/5_background/layers/3_third_layer/1.png',
    './assets/img/5_background/layers/3_third_layer/2.png',
    './assets/img/5_background/layers/2_second_layer/1.png',
    './assets/img/5_background/layers/2_second_layer/2.png',
    './assets/img/5_background/layers/1_first_layer/1.png',
    './assets/img/5_background/layers/1_first_layer/2.png',
    './assets/img/2_character_pepe/2_walk/W-21.png',
    './assets/img/2_character_pepe/2_walk/W-22.png',
    './assets/img/2_character_pepe/2_walk/W-23.png',
    './assets/img/2_character_pepe/2_walk/W-24.png',
    './assets/img/2_character_pepe/2_walk/W-25.png',
    './assets/img/2_character_pepe/2_walk/W-26.png',
    './assets/img/2_character_pepe/1_idle/idle/I-1.png',
    './assets/img/2_character_pepe/1_idle/idle/I-3.png',
    './assets/img/2_character_pepe/1_idle/idle/I-2.png',
    './assets/img/2_character_pepe/1_idle/idle/I-4.png',
    './assets/img/2_character_pepe/1_idle/idle/I-5.png',
    './assets/img/2_character_pepe/1_idle/idle/I-6.png',
    './assets/img/2_character_pepe/1_idle/idle/I-7.png',
    './assets/img/2_character_pepe/1_idle/idle/I-8.png',
    './assets/img/2_character_pepe/1_idle/idle/I-9.png',
    './assets/img/2_character_pepe/1_idle/idle/I-10.png',
    './assets/img/2_character_pepe/3_jump/J-31.png',
    './assets/img/2_character_pepe/3_jump/J-32.png',
    './assets/img/2_character_pepe/3_jump/J-33.png',
    './assets/img/2_character_pepe/3_jump/J-34.png',
    './assets/img/2_character_pepe/3_jump/J-35.png',
    './assets/img/2_character_pepe/3_jump/J-36.png',
    './assets/img/2_character_pepe/3_jump/J-37.png',
    './assets/img/2_character_pepe/3_jump/J-38.png',
    './assets/img/2_character_pepe/3_jump/J-39.png',
    './assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    './assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    './assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    './assets/img/8_coin/coin_1.png',
    './assets/img/8_coin/coin_2.png',
    './assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    './assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    './assets/img/5_background/layers/4_clouds/1.png',
    'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
    'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
    'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
    'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
    'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
    'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
    'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
    './assets/img/6_salsa_bottle/salsa_bottle.png',
    './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    './assets/img/6_salsa_bottle/bottle_rotation/bottle_squeeze/1_bottle_squeeze1.png',
    './assets/img/6_salsa_bottle/bottle_rotation/bottle_squeeze/3_bottle_squeeze3.png',
    './assets/img/6_salsa_bottle/bottle_rotation/bottle_squeeze/4_bottle_squeeze4.png',
]

/**
 * Initializes the application and starts asset preloading.
 */
function init() {
    turnYourPhone();
    endGame();
    preloadAllAssets();
}

/**
 * Starts the game after assets are preloaded.
 * @param {boolean} [loadingSpinner=true] - Whether to show the loading spinner.
 */
function playGame(loadingSpinner = true) {
    loadingSpinner && showMenuTab('loadingSpinner');
    let startTime = new Date().getTime();
    let checkFinished = setInterval(() => {
        let currentTime = new Date().getTime();
        let timePassed = currentTime - startTime;
        if (isPreloadFinished && timePassed > 2500) {
            clearInterval(checkFinished);
            prepareAndStartGame();
        } else { /* console.log('waiting for preload to finish...'); */ }
    }, 100);
}

/**
 * Restarts the game without showing the loading spinner.
 */
function replayGame() {
    endGame();
    playGame(false);
}

/**
 * Prepares UI and starts the game world.
 */
function prepareAndStartGame() {
    toggleHtmlElementDisplay('canvasWrapper', 'block');
    toggleHtmlElementDisplay('overlayMain', 'none');
    diplayAccordingMuteUnmuteVolumeIcons('canvasControlMenu', ['effect', 'music']);
    startGame();
}

/**
 * Preloads images used in the game and tracks progress.
 * @returns {Promise<void>} Resolves when preload setup is complete.
 */
async function preloadAllAssets() {
    loadingSpinnerImagesTotal = preloadImages.length;
    preloadImages.forEach((path) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            IMAGE_CACHE[path] = img;
            loadingSpinnerImages();
        }
        img.onerror = () => loadingSpinnerImages(); // Auch bei Fehler weitermachen
    });
}

/**
 * Updates preload counters and marks preload as finished.
 */
function loadingSpinnerImages() {
    loadingSpinnerImagesLoaded++;
    if (loadingSpinnerImagesLoaded >= loadingSpinnerImagesTotal && loadingSpinnerImagesTotal > 0) {
        isPreloadFinished = true;
    }
}

/**
 * Shows a specific menu tab and applies background.
 * @param {string} tabName - The tab id to display.
 * @param {string} [background=menuBg] - Background image style.
 */
function showMenuTab(tabName, background = menuBg) {
    setMidSectionBg(background);
    toggleHtmlElementDisplay('canvasWrapper', 'none');
    toggleHtmlElementDisplay('overlayMain', 'block');
    hideTabs();
    showTab(tabName);
    getVolumeFromLocalStorage();
    (tabName !== 'gameover' || tabName !== 'win' || tabName !== 'sounds') && titleTopAndBottomSection();
    (tabName === 'gameover' || tabName === 'win') && gameoverWinTopAndBottomSection();
    (tabName === 'sounds' && !initialSoundsDone) ? setDefaultSoundOptions() : setSoundsAccordingToLocalStorage();
    (tabName === 'rotateYourPhone' || tabName === 'loadingSpinner') && rotateYourPhoneTopAndBottomSection();
    stopRepeatableSounds();
}

document.addEventListener('DOMContentLoaded', turnYourPhone);
window.addEventListener('resize', turnYourPhone);

/**
 * Shows the rotate-your-phone overlay on small portrait screens.
 */
function turnYourPhone() {
    const isPortrait = window.innerWidth < window.innerHeight;
    const isTooSmall = window.innerWidth < 720 || window.innerHeight < 480;
    if (isTooSmall && isPortrait) {
        showMenuTab('rotateYourPhone');
    } else {
        showMenuTab('title', titleBg)
    }
}

/**
 * Applies default sound settings on first run.
 */

/**
 * Toggles the display style of an HTML element.
 * @param {string} element - The element id.
 * @param {string} display - The CSS display value.
 */
function toggleHtmlElementDisplay(element, display) {
    document.getElementById(element).style.display = display;
}

/**
 * Hides all tab sections.
 */
function hideTabs() {
    let tab = document.getElementsByClassName('tab');
    for (let i = 0; i < tab.length; i++) {
        tab[i].style.display = "none";
        tab[i].ariaSelected = "false";
    }
}

/**
 * Shows a single tab section.
 * @param {string} tabName - The tab id to display.
 */
function showTab(tabName) {
    document.getElementById(tabName).style.display = "flex";
    document.getElementById(tabName).ariaSelected = "true";
}

/**
 * Sets the background image for the mid section.
 * @param {string} background - Background image style.
 */
function setMidSectionBg(background) {
    midSection.style.backgroundImage = background;
}

/**
 * Renders top and bottom sections for the title screen.
 */
function titleTopAndBottomSection() {
    topSection.innerHTML = topSectionStandardTemplate();
    bottomSection.innerHTML = bottomSectionStandardTemplate();
}

/**
 * Renders top and bottom sections for win/gameover screens.
 */
function gameoverWinTopAndBottomSection() {
    topSection.innerHTML = topSectionGameoverWinTemplate();
    bottomSection.innerHTML = bottomSectionGameoverWinTemplate();
}

/**
 * Clears top and bottom sections for rotate/loader screens.
 */
function rotateYourPhoneTopAndBottomSection() {
    topSection.innerHTML = '';
    bottomSection.innerHTML = '';
}

/**
 * Persists current sound settings to local storage.
 */

/**
 * Shows the on-canvas keyboard controls for a short duration.
 * @param {Event} ev - The triggering event.
 */
function showCanvasKeyboardControls(ev) {
    controlOverlay.classList.remove('d-none');
    ev.currentTarget.blur();
    ev.stopPropagation();
    if (!showCanvasControlsIsActive) {
        showCanvasControlsIsActive = true;
        setTimeout(() => {
            controlOverlay.classList.add('d-none');
            showCanvasControlsIsActive = false;
        }, 3000);
    }
}

/**
 * Disables the context menu on touch control buttons.
 */
function disableTouchMenuContext() {
    document.querySelectorAll('.touch-menu button').forEach(btn => {
        btn.addEventListener('contextmenu', event => event.preventDefault());
    });
}

disableTouchMenuContext();
