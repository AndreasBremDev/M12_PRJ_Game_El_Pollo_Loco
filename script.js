let titleBg = 'url(./assets/img/9_intro_outro_screens/start/startscreen_1.png';
let menueBg = 'url(./assets/img/5_background/second_half_background.png)';
let midSection = document.getElementById('middleSection');
const progressEffectFill = document.getElementById('volumeEffectProgress');
const progressMusicFill = document.getElementById('volumeMusicProgress');
let effectVolumeMuted = false;
let musicVolumeMuted = false;
let currentEffectVolume;
let currentMusicVolume;


function playGame() {
    toggleCanvas('block');
    toggleAllOverlays('none');
    init();
}

function showMenuTab(tabName, background = menueBg) {
    toggleCanvas('none');
    toggleAllOverlays('block');
    hideTabs();
    setMidSectionBackground(background);
    showTab(tabName);
}

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

function setMidSectionBackground(background) {
    midSection.style.backgroundImage = background;
}

function setVolumeControl(elementToControl, upOrDown, step) {
    let element = document.getElementById(elementToControl)
    const current = parseInt(element.style.width);
    if (upOrDown == 'up') {
        if (current === 100) { return; }
        element.style.width = Math.max(0, current + step) + '%';
    }
    if (upOrDown == 'down') {
        if (current === 0) { return; }
        element.style.width = Math.min(100, current - step) + '%';
    }
    if (upOrDown == 'mute') {
        if (elementToControl == 'volumeEffectProgress') {currentEffectVolume = current;}
        if (elementToControl == 'volumeMusicProgress'){currentMusicVolume = current;}
        element.style.width = step +'%';
    }
    if (upOrDown == 'unmute') {
        if (elementToControl == 'volumeEffectProgress' && currentEffectVolume !== undefined) {
            element.style.width = currentEffectVolume + '%';
        } else if (elementToControl == 'volumeMusicProgress' && currentMusicVolume !== undefined) {
            element.style.width = currentMusicVolume + '%';
        }
    }
};

function setVolumeMute(unshow, show, elementToControl, mute, zeroVolume) {
    let elementON = document.getElementById(show);
    let elementOFF = document.getElementById(unshow);
    if (effectVolumeMuted) {
        toggleDisplayElementMute(elementON, elementOFF, elementToControl, false);
    } else {
        toggleDisplayElementMute(elementON, elementOFF, elementToControl, true);
    }
    setVolumeControl(elementToControl, mute, zeroVolume);
}

function toggleDisplayElementMute(elementON, elementOFF, elementToControl, muted) {
    elementON.style.display = 'block';
    elementOFF.style.display = 'none';
    if(elementToControl == 'volumeEffectProgress'){ effectVolumeMuted = muted};
    if(elementToControl == 'volumeMusicProgress'){ musicVolumeMuted = muted};
}
