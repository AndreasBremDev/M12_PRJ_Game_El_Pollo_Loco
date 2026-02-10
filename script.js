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
let loadingSpinnerDone = false;

function playGame() {
    if(!loadingSpinnerDone) {
        showMenuTab('loadingSpinner');
        setTimeout(() => {}, 3000);
        loadingSpinnerDone = true;
    }
        startGame();
        toggleHtmlElementDisplay('canvasWrapper', 'block');
        toggleHtmlElementDisplay('overlayMain', 'none');
        diplayAccordingMuteUnmuteVolumeIcons('canvasControlMenu', ['effect', 'music']);
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

// #region sound management

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
        window.sounds.playOnce(window.sounds.BACKGROUND_GAME, elementToControl);
    } else if (htmlDiv === 'canvasControlMenu') {
        if (typeof world !== 'undefined' && world && world.endbossMusicActive) {
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

// #endregion

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
