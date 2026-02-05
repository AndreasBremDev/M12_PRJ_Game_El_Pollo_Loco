let titleBg = 'url("./assets/img/9_intro_outro_screens/start/startscreen_1.png")';
let menuBg = 'url("./assets/img/5_background/second_half_background.png")';
let topSection = document.getElementById('topSection');
let midSection = document.getElementById('middleSection');
let bottomSection = document.getElementById('bottomSection');
const progressEffectFill = document.getElementById('volumeEffectProgress');
const progressMusicFill = document.getElementById('volumeMusicProgress');
initialSoundsDone = false;

function playGame() {
    toggleHtmlElementDisplay('canvasWrapper', 'block');
    toggleHtmlElementDisplay('overlayMain', 'none');
    startGame();
    diplayAccordingMuteUnmuteVolumeIcons('canvasControlMenu', ['effect', 'music']);
}

function showMenuTab(tabName, background = menuBg) {
    setMidSectionBg(background);
    toggleHtmlElementDisplay('canvasWrapper', 'none');
    toggleHtmlElementDisplay('overlayMain', 'block');
    hideTabs();
    showTab(tabName);
    (tabName !== 'gameover' || tabName !== 'win' || tabName !== 'sounds') && titleTopAndBottomSection();
    (tabName === 'gameover' || tabName === 'win') && gameoverWinTopAndBottomSection();
    (tabName === 'sounds') && setDefaultSoundOptions();
    (tabName === 'rotateYourPhone') && rotateYourPhoneTopAndBottomSection();
    window.sounds.stop(window.sounds.BACKGROUND_GAME);
}

function setDefaultSoundOptions() {
    if (!initialSoundsDone) {
        initialSoundSettings('overlayMain', ['effect', 'music']);
        initialSoundsDone = true;
    }
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
}

function getVolumeFromLocalStorage() {
    let volumeIsMutedFromStorage = JSON.parse(localStorage.getItem('volumeIsMuted'));
    let volumeCurrentFromStorage = JSON.parse(localStorage.getItem('volumeCurrent'));
    volumeIsMutedFromStorage && (window.sounds.volumeIsMuted = volumeIsMutedFromStorage);
    volumeCurrentFromStorage && (window.sounds.volumeCurrent = volumeCurrentFromStorage);
}

function initialSoundSettings(htmlDiv, array) {
    // getVolumeFromLocalStorage();
    toggleMuteIcons(htmlDiv, array);
    setVolumeBarToZero(htmlDiv, array);
    // setVolumeToLocalStorage();
}


function soundControl(htmlDiv, elementToControl, value) {
    // getVolumeFromLocalStorage();
    if (window.sounds.volumeIsMuted[elementToControl] && window.sounds.volumeCurrent[elementToControl] > 0.2 && Math.round(window.sounds.volumeCurrent[elementToControl]) <= 1 && value > 0) {
        window.sounds.volumeCurrent[elementToControl] = 0.2;
        muteUnmute(htmlDiv, elementToControl);
        checkAndPlaySounds(elementToControl);
    } else if ((window.sounds.volumeIsMuted[elementToControl] && value > 0) || (!window.sounds.volumeIsMuted[elementToControl] && window.sounds.volumeCurrent[elementToControl] === 0.2 && value < 0)) {
        muteUnmute(htmlDiv, elementToControl);
    } else if ((window.sounds.volumeIsMuted[elementToControl] && value < 0) || (window.sounds.volumeCurrent[elementToControl] === 1 && value > 0)) {
        checkAndPlaySounds(elementToControl); return;
    } else {
        setVolumeCurrentOfElementToControl(elementToControl, value)
        setVolumeInHTML(htmlDiv, elementToControl);
    }
    // setVolumeToLocalStorage();
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
        window.sounds.playLoop(window.sounds.BACKGROUND_GAME, elementToControl);
    }
}

function muteUnmute(htmlDiv, elementToControl) {
    // getVolumeFromLocalStorage();
    toggleVolumeMuteBoolean(elementToControl);
    toggleMuteIcons(htmlDiv, elementToControl);
    if (htmlDiv === 'overlayMain') { window.sounds.volumeIsMuted[elementToControl] ? setVolumeBarToZero(htmlDiv, elementToControl) : setVolumeInHTML(htmlDiv, elementToControl); }
    if (htmlDiv === 'canvasControlMenu') { 
        if (window.sounds.volumeIsMuted[elementToControl]){
            elementToControl === 'effect' ? window.sounds.stop(window.sounds.MENU_CLICK) : window.sounds.stop(window.sounds.BACKGROUND_GAME);
        } else { 
            checkAndPlaySounds(htmlDiv, elementToControl); 
        }
    }
    // setVolumeToLocalStorage();
}

function setVolumeInHTML(htmlDiv, elementToControl) {
    let progressBar = document.getElementById(htmlDiv).querySelector('#' + elementToControl + 'VolumeProgressBar');
    progressBar.style.width = window.sounds.volumeCurrent[elementToControl] * 100 + '%';
    checkAndPlaySounds(htmlDiv, elementToControl);
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
    // setVolumeToLocalStorage();
    return window.sounds.volumeIsMuted[elementToControl];
}

function setvolumeIsMuted(elementToControl, bool) {
    window.sounds.volumeIsMuted[elementToControl] = bool;
    return window.sounds.volumeIsMuted[elementToControl];
}

function diplayAccordingMuteUnmuteVolumeIcons(htmlDiv, array){
    // getVolumeFromLocalStorage();
    toggleMuteIcons(htmlDiv, array);
    // setVolumeToLocalStorage();
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