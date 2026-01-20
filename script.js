let titleBg = 'url(./assets/img/9_intro_outro_screens/start/startscreen_1.png';
let menueBg = 'url(./assets/img/5_background/second_half_background.png)'
let midSection = document.getElementById('middleSection');
const progressEffectFill = document.getElementById('volumeEffectProgress');
const progressMusicFill = document.getElementById('volumeMusicProgress');

function setMidSectionBackground(background) {
    midSection.style.backgroundImage = background;
}

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
    canvas.style.display = display;
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
        element.style.width = '0%';
    }
};

function setVolumeMute(show, noShow, elementToControl, upOrDown, step) {
    let elementShow = document.getElementById(show);
    let elementNoShow = document.getElementById(noShow);
    elementShow.style.display = 'block';
    elementNoShow.style.display = 'none';
    setVolumeControl(elementToControl, upOrDown, step);

}