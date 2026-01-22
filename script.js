let titleBg = 'url(./assets/img/9_intro_outro_screens/start/startscreen_1.png';
let menueBg = 'url(./assets/img/5_background/second_half_background.png)';
let midSection = document.getElementById('middleSection');
const progressEffectFill = document.getElementById('volumeEffectProgress');
const progressMusicFill = document.getElementById('volumeMusicProgress');
let volumeMuted = {
    'effect': true, // wenn true, dann Ton auch auf 0 setzen
    'music': true   // wenn false, dann Ton auf gespeicherten Wert volumeCurrent[effect/music] setzen
};
let volumeCurrent = {
    'effect': 20,
    'music': 20
};
initialSoundsDone = false;

function playGame() {
    toggleCanvas('block');
    toggleAllOverlays('none');
    init();
}

function showMenuTab(tabName, background = menueBg) {
    setMidSectionBg(background);
    toggleCanvas('none');
    toggleAllOverlays('block');
    hideTabs();
    showTab(tabName);
    if (tabName === 'sounds') {
        if (!initialSoundsDone) {
            initialSoundSettings(['effect', 'music']);
            initialSoundsDone = true;
        }
        ///////// make Mute button von JS abhängig /////////
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

// Mögichkeit1: 2 Funktionen: eine für Mute und eine für Unmute (je Funktion gleiche Logik)

// Mögichkeit2: 1 Funktion: Mute-Variable ändern + ProgressBar* anpassen
// setMuteProperty(elementToControl, 'mute' or 'unmute')
// mute oder unmute -> HTML-element entsprechend (holen) if(unmuteButton){ show muteButton, hide unmuteButton} else {vice versa}

// *changeProgressBar(elementToControl, width)


// DONE: Daten nicht hardcoden(HTML), sondern per JS setzen
// DONE: Werte in HTML setzen
// DONE: Werte mit JS in HTML für ProgressBars (effect + music) am Anfang setzen !
// DONE: ggf. in localStorage speichern und von dort laden

// wenn MUTE was muss ich machen?
//     blende den muteButton aus
//     blende den unMuteButton ein
//     Variable mute = true
//     ProgressBar = 0

// wenn UNMUTE was muss ich machen?
//     blende den unMuteButton aus
//     blende den muteButton ein
//     Variable mute = false
//     ProgressBar.width = volume[music oder effect]

// function setVolumeCurrent(elementToControl, current) {
//     volumeCurrent[elementToControl] = current;
//     return volumeCurrent[elementToControl];
// }


function setVolumeControl(elementToControl, upOrDown, step) {
    let progressBar = document.getElementById(elementToControl + 'VolumeProgressBar');
    // statt current (daten aus HTML ziehen) besser aus variable holen 
    let current = parseInt(progressBar.style.width);
    if (upOrDown == 'up') {
        if (current === 100) { return; }
        progressBar.style.width = Math.max(0, current + step) + '%';
        // Werte NEU (volumeCurrent[effect/music]) speichern
        // + ggf. in localStorage speichern
        // + Werte NEU in HTML setzen ** neue FUNCTION

    }
    if (upOrDown == 'down') {
        if (current === 0) { return; }
        if (current === 20) {
            /* setVolumeMute(unshow, show, elementToControl, mute, zeroVolume) */
        }
        progressBar.style.width = Math.min(100, current - step) + '%';
    }
};

function setVolumeMute(unshow, show, elementToControl, mute, zeroVolume) {
    let progressBar = document.getElementById(elementToControl + 'VolumeProgressBar');
    // current brauche ich dann so nicht mehr - Zugriff auf variable volumeCurrent[effect/music]
    let current = parseInt(progressBar.style.width);
    let elementON = document.getElementById(show);
    let elementOFF = document.getElementById(unshow);

    //
    if (volumeMuted[elementToControl] === true) {
        // welche Buttons muss ich ändern?
        toggleMuteElement(elementON, elementOFF);
        setVolumeMuted(elementToControl, false);
        if (mute == 'mute') {
            setVolumeCurrent(elementToControl, current);
            // ProgressBar auf Null
            progressBar.style.width = zeroVolume + '%';
        }
        if (mute == 'unmute') {
            if (volumeCurrent[elementToControl] !== undefined) {
                progressBar.style.width = effectVolumeCurrent + '%';
            } else if (elementToControl == 'music' && musicVolumeCurrent !== undefined) {
                progressBar.style.width = musicVolumeCurrent + '%';
            }
        }
    } else if (volumeMuted[elementToControl] === false) {
        console.log(`volumeMuted[${elementToControl}] = `, volumeMuted[elementToControl]);
        console.log(`volumeCurrent[${elementToControl}] = `, volumeCurrent[elementToControl]);
        // progressBar auf gespeicherten Wert setzen
        toggleMuteElement(elementON, elementOFF);
        setVolumeMuted(elementToControl, true);
        if (mute == 'mute') {
            setVolumeCurrent(elementToControl, current);
            progressBar.style.width = zeroVolume + '%';
        }
        if (mute == 'unmute') {
            if (volumeCurrent[elementToControl] !== undefined) {
                progressBar.style.width = effectVolumeCurrent + '%';
            } else if (elementToControl == 'music' && musicVolumeCurrent !== undefined) {
                progressBar.style.width = musicVolumeCurrent + '%';
            }
        }
        // setVolumeControl(elementToControl, mute, zeroVolume);
    }
}