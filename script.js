let titleBg = 'url("./assets/img/9_intro_outro_screens/start/startscreen_1.png")';
let menuBg = 'url("./assets/img/5_background/second_half_background.png")';
let midSection = document.getElementById('middleSection');
const progressEffectFill = document.getElementById('volumeEffectProgress');
const progressMusicFill = document.getElementById('volumeMusicProgress');
let volumeMuted = {
    'effect': true,
    'music': true
};
let volumeCurrent = {
    'effect': 20,
    'music': 20
};
initialSoundsDone = false;

function playGame() {
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
    (tabName !== 'gameover' || tabName !== 'win' || tabName !== 'sounds') && updateStandardTopAndBottomSection();
    (tabName === 'gameover' || tabName === 'win') && updateGameoverWinTopAndBottomSection();
    (tabName === 'sounds') && setDefaultSoundOptions();
        ///////// make Mute button von JS abhängig /////////
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

function updateStandardTopAndBottomSection() {
    let topSection = document.getElementById('topSection');
    let bottomSection = document.getElementById('bottomSection');
    topSection.innerHTML = topSectionStandardTemplate();
    bottomSection.innerHTML = bottomSectionStandardTemplate();
}

function updateGameoverWinTopAndBottomSection() {
    let topSection = document.getElementById('topSection');
    let bottomSection = document.getElementById('bottomSection');
    topSection.innerHTML = topSectionGameoverWinTemplate();
    bottomSection.innerHTML = bottomSectionGameoverWinTemplate();
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
    toggleMuteIcons(array)
    setVolumeBarToZero(array)
    // setVolumeToLocalStorage();
}


function soundControl(elementToControl, value) {
    if (volumeMuted[elementToControl] && volumeCurrent[elementToControl] > 20 && volumeCurrent[elementToControl] <= 100 && value > 0) {
        volumeCurrent[elementToControl] = 20;
        muteUnmute(elementToControl);
    } else if ((volumeMuted[elementToControl] && value > 0) || (!volumeMuted[elementToControl] && volumeCurrent[elementToControl] === 20 && value < 0)) {
        muteUnmute(elementToControl);
    } else if ((volumeMuted[elementToControl] && value < 0) || (volumeCurrent[elementToControl] === 100 && value > 0)) {
        return;
    } else {
        volumeCurrent[elementToControl] += value;
        setVolumeInHTML(elementToControl);
    }
}

function muteUnmute(elementToControl) {
    // getVolumeFromLocalStorage();
    toggleVolumeMuteBoolean(elementToControl);
    toggleMuteIcons(elementToControl);
    volumeMuted[elementToControl] ? setVolumeBarToZero(elementToControl) : setVolumeInHTML(elementToControl);
    // setVolumeToLocalStorage();
}

function setVolumeInHTML(elementToControl) {
    let progressBar = document.getElementById(elementToControl + 'VolumeProgressBar');
    progressBar.style.width = volumeCurrent[elementToControl] + '%';
}

function toggleMuteIcons(elementToControl) {
    if (Array.isArray(elementToControl)) {
        elementToControl.forEach(el => toggleMuteIcons(el));
        return;
    }
    let [iconON, iconOFF] = ['_on', '_off'].map(suffix => document.getElementById(elementToControl + suffix))
    volumeMuted[elementToControl] ? toggleMuteElement(iconOFF, iconON) : toggleMuteElement(iconON, iconOFF);
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
    progressBar.style.width = '0%';
}

function toggleVolumeMuteBoolean(elementToControl) {
    volumeMuted[elementToControl] ? setVolumeMuted(elementToControl, false) : setVolumeMuted(elementToControl, true);
    // setVolumeToLocalStorage();
    return volumeMuted[elementToControl];
}

function setVolumeMuted(elementToControl, bool) {
    volumeMuted[elementToControl] = bool;
    return volumeMuted[elementToControl];
}

