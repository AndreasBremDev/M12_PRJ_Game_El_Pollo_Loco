let titleBg = 'url("./assets/img/9_intro_outro_screens/start/startscreen_1.png")';
let menuBg = 'url("./assets/img/5_background/second_half_background.png")';
let topSection = document.getElementById('topSection');
let midSection = document.getElementById('middleSection');
let bottomSection = document.getElementById('bottomSection');
const progressEffectFill = document.getElementById('volumeEffectProgress');
const progressMusicFill = document.getElementById('volumeMusicProgress');
let controlOverlay = document.getElementById('canvasControl');
let initialSoundsDone = false;
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

function init() {
    turnYourPhone();
    endGame();
    preloadAllAssets();
}

function playGame() {
    showMenuTab('loadingSpinner');
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

function prepareAndStartGame() {
    toggleHtmlElementDisplay('canvasWrapper', 'block');
    toggleHtmlElementDisplay('overlayMain', 'none');
    diplayAccordingMuteUnmuteVolumeIcons('canvasControlMenu', ['effect', 'music']);
    startGame();
}

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

function loadingSpinnerImages() {
    loadingSpinnerImagesLoaded++;
    if (loadingSpinnerImagesLoaded >= loadingSpinnerImagesTotal && loadingSpinnerImagesTotal > 0) {
        isPreloadFinished = true;
    }
}

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
    window.sounds.stop(window.sounds.BACKGROUND_GAME);
}

document.addEventListener('DOMContentLoaded', turnYourPhone);
window.addEventListener('resize', turnYourPhone);

function turnYourPhone() {
    const isPortrait = window.innerWidth < window.innerHeight;
    const isTooSmall = window.innerWidth < 720 || window.innerHeight < 480;
    if (isTooSmall && isPortrait) {
        showMenuTab('rotateYourPhone');
    } else {
        showMenuTab('title', titleBg)
    }
}

function setDefaultSoundOptions() {
    initialSoundSettings('overlayMain', ['effect', 'music']);
    initialSoundsDone = true;
    setVolumeToLocalStorage()
}

function setSoundsAccordingToLocalStorage() {
    toggleMuteIcons('overlayMain', ['effect', 'music']);
    window.sounds.volumeIsMuted['effect'] ? setVolumeBarToZero('overlayMain', 'effect') : setVolumeInHTML('overlayMain', 'effect')
    window.sounds.volumeIsMuted['music'] ? setVolumeBarToZero('overlayMain', 'music') : setVolumeInHTML('overlayMain', 'music')
}

function toggleHtmlElementDisplay(element, display) {
    document.getElementById(element).style.display = display;
}

function hideTabs() {
    let tab = document.getElementsByClassName('tab');
    for (let i = 0; i < tab.length; i++) {
        tab[i].style.display = "none";
        tab[i].ariaSelected = "false";
    }
}

function showTab(tabName) {
    document.getElementById(tabName).style.display = "flex";
    document.getElementById(tabName).ariaSelected = "true";
}

function setMidSectionBg(background) {
    midSection.style.backgroundImage = background;
}

function titleTopAndBottomSection() {
    topSection.innerHTML = topSectionStandardTemplate();
    bottomSection.innerHTML = bottomSectionStandardTemplate();
}

function gameoverWinTopAndBottomSection() {
    topSection.innerHTML = topSectionGameoverWinTemplate();
    bottomSection.innerHTML = bottomSectionGameoverWinTemplate();
}

function rotateYourPhoneTopAndBottomSection() {
    topSection.innerHTML = '';
    bottomSection.innerHTML = '';
}

function setVolumeToLocalStorage() {
    localStorage.setItem('volumeIsMuted', JSON.stringify(window.sounds.volumeIsMuted));
    localStorage.setItem('volumeCurrent', JSON.stringify(window.sounds.volumeCurrent));
    localStorage.setItem('initialSoundsDone', JSON.stringify(initialSoundsDone));
}

function getVolumeFromLocalStorage() {
    let volumeIsMutedFromStorage = JSON.parse(localStorage.getItem('volumeIsMuted'));
    let volumeCurrentFromStorage = JSON.parse(localStorage.getItem('volumeCurrent'));
    let initialSoundsDoneFromStorage = JSON.parse(localStorage.getItem('initialSoundsDone'));
    volumeIsMutedFromStorage && (window.sounds.volumeIsMuted = volumeIsMutedFromStorage);
    volumeCurrentFromStorage && (window.sounds.volumeCurrent = volumeCurrentFromStorage);
    initialSoundsDoneFromStorage && (initialSoundsDone = initialSoundsDoneFromStorage);
}

function initialSoundSettings(htmlDiv, array) {
    toggleMuteIcons(htmlDiv, array);
    setVolumeBarToZero(htmlDiv, array);
    setVolumeToLocalStorage();
}

function soundControl(htmlDiv, elementToControl, value, ev) {
    if (window.sounds.volumeIsMuted[elementToControl] && window.sounds.volumeCurrent[elementToControl] > 0.2 && Math.round(window.sounds.volumeCurrent[elementToControl]) <= 1 && value > 0) {
        window.sounds.volumeCurrent[elementToControl] = 0.2;
        setVolumeToLocalStorage();
        muteUnmute(htmlDiv, elementToControl, ev);
        setVolumeInHTML(htmlDiv, elementToControl)
        checkAndPlaySounds(elementToControl);
    } else if ((window.sounds.volumeIsMuted[elementToControl] && value > 0) || (!window.sounds.volumeIsMuted[elementToControl] && window.sounds.volumeCurrent[elementToControl] === 0.2 && value < 0)) {
        muteUnmute(htmlDiv, elementToControl, ev);
    } else if ((window.sounds.volumeIsMuted[elementToControl] && value < 0) || (window.sounds.volumeCurrent[elementToControl] === 1 && value > 0)) {
        checkAndPlaySounds(elementToControl); return;
    } else {
        getVolumeFromLocalStorage();
        setVolumeCurrentOfElementToControl(elementToControl, value)
        setVolumeInHTML(htmlDiv, elementToControl);
        checkAndPlaySounds(htmlDiv, elementToControl);
        setVolumeToLocalStorage();
    }
}

function setVolumeCurrentOfElementToControl(elementToControl, value) {
    window.sounds.volumeCurrent[elementToControl] += value;
    let step = Math.abs(value) || 0.2;
    const steps = Math.round(1 / step);
    const snapped = Math.round(window.sounds.volumeCurrent[elementToControl] * steps) / steps;
    window.sounds.volumeCurrent[elementToControl] = Math.min(1, Math.max(0, snapped));
}

function checkAndPlaySounds(htmlDiv, elementToControl) {
    if (elementToControl === 'effect') {
        window.sounds.playOnce(window.sounds.MENU_CLICK, elementToControl)
    } else if (htmlDiv === 'overlayMain') {
        window.sounds.playLoop(window.sounds.BACKGROUND_ENDBOSS, elementToControl);
        window.sounds.stop(window.sounds.BACKGROUND_ENDBOSS);
        window.sounds.playOnce(window.sounds.BACKGROUND_GAME, elementToControl);
    } else if (htmlDiv === 'canvasControlMenu') {
        console.log('world !== undefined: ', world !== 'undefined', 'world: ', world, 'world.endbossMet: ', world.endbossMet);

        if (typeof world !== 'undefined' && world && world.endbossMet) {
            window.sounds.playLoop(window.sounds.BACKGROUND_ENDBOSS, elementToControl);
        } else {
            window.sounds.playLoop(window.sounds.BACKGROUND_GAME, elementToControl);
        }
    }
}

function muteUnmute(htmlDiv, elementToControl, ev) {
    eventBlurAndStopPropagation(ev);
    getVolumeFromLocalStorage();
    toggleVolumeMuteBoolean(elementToControl);
    toggleMuteIcons(htmlDiv, elementToControl);
    if (htmlDiv === 'overlayMain') { window.sounds.volumeIsMuted[elementToControl] ? setVolumeBarToZero(htmlDiv, elementToControl) : (setVolumeInHTML(htmlDiv, elementToControl), checkAndPlaySounds(htmlDiv, elementToControl)); }
    if (htmlDiv === 'canvasControlMenu') {
        if (window.sounds.volumeIsMuted[elementToControl]) {
            elementToControl === 'effect' ? window.sounds.stop(window.sounds.MENU_CLICK) : window.sounds.stop(window.sounds.BACKGROUND_GAME);
        } else {
            checkAndPlaySounds(htmlDiv, elementToControl);
        }
    }
    setVolumeToLocalStorage();
}

function eventBlurAndStopPropagation(ev) {
    ev.currentTarget.blur();
    ev.stopPropagation();
}

function setVolumeInHTML(htmlDiv, elementToControl) {
    let progressBar = document.getElementById(htmlDiv).querySelector('#' + elementToControl + 'VolumeProgressBar');
    progressBar.style.width = window.sounds.volumeCurrent[elementToControl] * 100 + '%';
}

function toggleMuteIcons(htmlDiv, elementToControl) {
    if (Array.isArray(elementToControl)) {
        elementToControl.forEach(el => toggleMuteIcons(htmlDiv, el));
        return;
    }
    let [iconON, iconOFF] = ['_on', '_off'].map(suffix => document.getElementById(htmlDiv).querySelector('#' + elementToControl + suffix))
    window.sounds.volumeIsMuted[elementToControl] ? toggleMuteElement(iconOFF, iconON) : toggleMuteElement(iconON, iconOFF);
}

function toggleMuteElement(iconON, iconOFF) {
    iconON.style.display = 'block';
    iconOFF.style.display = 'none';
}

function setVolumeBarToZero(htmlDiv, elementToControl) {
    if (Array.isArray(elementToControl)) {
        elementToControl.forEach(el => setVolumeBarToZero(htmlDiv, el));
        return;
    }
    let progressBar = document.getElementById(htmlDiv).querySelector('#' + elementToControl + 'VolumeProgressBar');
    elementToControl === 'effect' ? window.sounds.stop(window.sounds.MENU_CLICK) : window.sounds.stop(window.sounds.BACKGROUND_GAME);
    progressBar.style.width = '0%';
}

function toggleVolumeMuteBoolean(elementToControl) {
    window.sounds.volumeIsMuted[elementToControl] ? setvolumeIsMuted(elementToControl, false) : setvolumeIsMuted(elementToControl, true);
    return;
}

function setvolumeIsMuted(elementToControl, bool) {
    window.sounds.volumeIsMuted[elementToControl] = bool;
    return window.sounds.volumeIsMuted[elementToControl];
}

function diplayAccordingMuteUnmuteVolumeIcons(htmlDiv, array) {
    toggleMuteIcons(htmlDiv, array);
}

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

document.querySelectorAll('.touch-menu button').forEach(btn => {
    btn.addEventListener('contextmenu', event => event.preventDefault());
});
