let titleBg = 'url("./assets/img/9_intro_outro_screens/start/startscreen_1.png")';
let menuBg = 'url("./assets/img/5_background/second_half_background.png")';
let topSection = document.getElementById('topSection');
let midSection = document.getElementById('middleSection');
let bottomSection = document.getElementById('bottomSection');
const progressEffectFill = document.getElementById('volumeEffectProgress');
const progressMusicFill = document.getElementById('volumeMusicProgress');
initialSoundsDone = false;

function playGame() {
    window.sounds.stop(window.sounds.BACKGROUND_GAME);
    toggleCanvas('block');
    toggleAllOverlays('none');
    startGame();
}

function showMenuTab(tabName, background = menuBg) {
    setMidSectionBg(background);
    toggleCanvas('none');
    toggleAllOverlays('block');
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
        initialSoundSettings(['effect', 'music']);
        initialSoundsDone = true;
    }
}

// #region canvas and overlay

function toggleCanvas(display) {
    document.getElementById('canvas').style.display = display;
}

function toggleAllOverlays(display) {
    allOverlays = document.getElementById('overlays');
    allOverlays.style.display = display;
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

// #endregion

function setVolumeToLocalStorage() {
    localStorage.setItem('volumeMuted', JSON.stringify(volumeMuted));
    localStorage.setItem('volumeCurrent', JSON.stringify(volumeCurrent));
}

function getVolumeFromLocalStorage() {
    let volumeMutedFromStorage = JSON.parse(localStorage.getItem('volumeMuted'));
    let volumeCurrentFromStorage = JSON.parse(localStorage.getItem('volumeCurrent'));
    volumeMutedFromStorage && (volumeMuted = volumeMutedFromStorage);
    volumeCurrentFromStorage && (volumeCurrent = volumeCurrentFromStorage);
}

function initialSoundSettings(array) {
    // getVolumeFromLocalStorage();
    toggleMuteIcons(array);
    setVolumeBarToZero(array);
    window.sounds.isMuted = true
    // setVolumeToLocalStorage();
}


function soundControl(elementToControl, value) {
    if (window.sounds.volumeMuted[elementToControl] && window.sounds.volumeCurrent[elementToControl] > 0.2 && Math.round(window.sounds.volumeCurrent[elementToControl]) <= 1 && value > 0) {
        window.sounds.volumeCurrent[elementToControl] = 0.2;
        muteUnmute(elementToControl);
        checkAndPlaySounds(elementToControl);
    } else if ((window.sounds.volumeMuted[elementToControl] && value > 0) || (!window.sounds.volumeMuted[elementToControl] && window.sounds.volumeCurrent[elementToControl] === 0.2 && value < 0)) {
        muteUnmute(elementToControl);
    } else if ((window.sounds.volumeMuted[elementToControl] && value < 0) || (window.sounds.volumeCurrent[elementToControl] === 1 && value > 0)) {
        checkAndPlaySounds(elementToControl); return;
    } else {
        checkAndPlaySounds(elementToControl);
        window.sounds.volumeCurrent[elementToControl] += value;
        setVolumeInHTML(elementToControl);
    }
}

function checkAndPlaySounds(elementToControl) {
    if (elementToControl === 'effect') {
        window.sounds.playOnce(window.sounds.MENU_CLICK, elementToControl)
    } else {
        window.sounds.playOnce(window.sounds.BACKGROUND_GAME, elementToControl);
    }
}

function muteUnmute(elementToControl) {
    // getVolumeFromLocalStorage();
    toggleVolumeMuteBoolean(elementToControl);
    toggleMuteIcons(elementToControl);
    window.sounds.volumeMuted[elementToControl] ? setVolumeBarToZero(elementToControl) : setVolumeInHTML(elementToControl);
    // setVolumeToLocalStorage();
}

function setVolumeInHTML(elementToControl) {
    let progressBar = document.getElementById(elementToControl + 'VolumeProgressBar');
    progressBar.style.width = window.sounds.volumeCurrent[elementToControl] * 100 + '%';
    checkAndPlaySounds(elementToControl);
}

function toggleMuteIcons(elementToControl) {
    if (Array.isArray(elementToControl)) {
        elementToControl.forEach(el => toggleMuteIcons(el));
        return;
    }
    let [iconON, iconOFF] = ['_on', '_off'].map(suffix => document.getElementById(elementToControl + suffix))
    window.sounds.volumeMuted[elementToControl] ? toggleMuteElement(iconOFF, iconON) : toggleMuteElement(iconON, iconOFF);
}

function toggleMuteElement(iconON, iconOFF) {
    iconON.style.display = 'block';
    iconOFF.style.display = 'none';
}

function setVolumeBarToZero(elementToControl) {
    if (Array.isArray(elementToControl)) {
        elementToControl.forEach(el => setVolumeBarToZero(el));
        return;
    }
    let progressBar = document.getElementById(elementToControl + 'VolumeProgressBar');
    elementToControl === 'effect' ? window.sounds.stop(window.sounds.MENU_CLICK) : window.sounds.stop(window.sounds.BACKGROUND_GAME);
    progressBar.style.width = '0%';
}

function toggleVolumeMuteBoolean(elementToControl) {
    window.sounds.volumeMuted[elementToControl] ? setVolumeMuted(elementToControl, false) : setVolumeMuted(elementToControl, true);
    // setVolumeToLocalStorage();
    return window.sounds.volumeMuted[elementToControl];
}

function setVolumeMuted(elementToControl, bool) {
    window.sounds.volumeMuted[elementToControl] = bool;
    return window.sounds.volumeMuted[elementToControl];
}

document.addEventListener('DOMContentLoaded', turnYourPhone);
window.addEventListener('resize', turnYourPhone);

function turnYourPhone() {
    const isPortrait = window.innerWidth < window.innerHeight;
    const isTooSmall = window.innerWidth < 720 || window.innerHeight < 480;

    if (isTooSmall && isPortrait) {
        document.getElementById('middleSection').style.borderRadius = '15px';
        showMenuTab('rotateYourPhone');
    } else {
        document.getElementById('middleSection').style.borderRadius = 'unset';
        showMenuTab('title', titleBg)
    }
}