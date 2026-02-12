let initialSoundsDone = false;

/**
 * Applies default sound settings on first run.
 */
function setDefaultSoundOptions() {
    initialSoundSettings('overlayMain', ['effect', 'music']);
    initialSoundsDone = true;
    setVolumeToLocalStorage();
}

/**
 * Syncs sound settings from local storage to UI.
 */
function setSoundsAccordingToLocalStorage() {
    toggleMuteIcons('overlayMain', ['effect', 'music']);
    window.sounds.volumeIsMuted['effect'] ? setVolumeBarToZero('overlayMain', 'effect') : setVolumeInHTML('overlayMain', 'effect');
    window.sounds.volumeIsMuted['music'] ? setVolumeBarToZero('overlayMain', 'music') : setVolumeInHTML('overlayMain', 'music');
}

/**
 * Persists current sound settings to local storage.
 */
function setVolumeToLocalStorage() {
    localStorage.setItem('volumeIsMuted', JSON.stringify(window.sounds.volumeIsMuted));
    localStorage.setItem('volumeCurrent', JSON.stringify(window.sounds.volumeCurrent));
    localStorage.setItem('initialSoundsDone', JSON.stringify(initialSoundsDone));
}

/**
 * Loads sound settings from local storage.
 */
function getVolumeFromLocalStorage() {
    let volumeIsMutedFromStorage = JSON.parse(localStorage.getItem('volumeIsMuted'));
    let volumeCurrentFromStorage = JSON.parse(localStorage.getItem('volumeCurrent'));
    let initialSoundsDoneFromStorage = JSON.parse(localStorage.getItem('initialSoundsDone'));
    volumeIsMutedFromStorage && (window.sounds.volumeIsMuted = volumeIsMutedFromStorage);
    volumeCurrentFromStorage && (window.sounds.volumeCurrent = volumeCurrentFromStorage);
    initialSoundsDoneFromStorage && (initialSoundsDone = initialSoundsDoneFromStorage);
}

/**
 * Initializes sound settings and UI state.
 * @param {string} htmlDiv - The container element id.
 * @param {string[]} array - Array of sound types.
 */
function initialSoundSettings(htmlDiv, array) {
    toggleMuteIcons(htmlDiv, array);
    setVolumeBarToZero(htmlDiv, array);
    setVolumeToLocalStorage();
}

/**
 * Updates volume or mute state based on input controls.
 * @param {string} htmlDiv - The container element id.
 * @param {'effect'|'music'} elementToControl - The audio type to control.
 * @param {number} value - The change step for the volume.
 * @param {Event} ev - The triggering event.
 */
function soundControl(htmlDiv, elementToControl, value, ev) {
    if (window.sounds.volumeIsMuted[elementToControl] && window.sounds.volumeCurrent[elementToControl] > 0.2 && Math.round(window.sounds.volumeCurrent[elementToControl]) <= 1 && value > 0) {
        window.sounds.volumeCurrent[elementToControl] = 0.2;
        setVolumeToLocalStorage();
        muteUnmute(htmlDiv, elementToControl, ev);
        setVolumeInHTML(htmlDiv, elementToControl);
        checkAndPlaySounds(elementToControl);
    } else if ((window.sounds.volumeIsMuted[elementToControl] && value > 0) || (!window.sounds.volumeIsMuted[elementToControl] && window.sounds.volumeCurrent[elementToControl] === 0.2 && value < 0)) {
        muteUnmute(htmlDiv, elementToControl, ev);
    } else if ((window.sounds.volumeIsMuted[elementToControl] && value < 0) || (window.sounds.volumeCurrent[elementToControl] === 1 && value > 0)) {
        checkAndPlaySounds(elementToControl);
        return;
    } else {
        getVolumeFromLocalStorage();
        setVolumeCurrentOfElementToControl(elementToControl, value);
        setVolumeInHTML(htmlDiv, elementToControl);
        checkAndPlaySounds(htmlDiv, elementToControl);
        setVolumeToLocalStorage();
    }
}

/**
 * Adjusts and snaps volume to valid steps.
 * @param {'effect'|'music'} elementToControl - The audio type to control.
 * @param {number} value - The change step for the volume.
 */
function setVolumeCurrentOfElementToControl(elementToControl, value) {
    window.sounds.volumeCurrent[elementToControl] += value;
    let step = Math.abs(value) || 0.2;
    const steps = Math.round(1 / step);
    const snapped = Math.round(window.sounds.volumeCurrent[elementToControl] * steps) / steps;
    window.sounds.volumeCurrent[elementToControl] = Math.min(1, Math.max(0, snapped));
}

/**
 * Plays preview sounds based on context.
 * @param {string} htmlDiv - The container element id.
 * @param {'effect'|'music'} elementToControl - The audio type to control.
 */
function checkAndPlaySounds(htmlDiv, elementToControl) {
    if (elementToControl === 'effect') {
        window.sounds.playOnce(window.sounds.MENU_CLICK, elementToControl);
    } else if (htmlDiv === 'overlayMain') {
        window.sounds.playLoop(window.sounds.BACKGROUND_ENDBOSS, elementToControl);
        setTimeout(() => {window.sounds.stop(window.sounds.BACKGROUND_ENDBOSS);}, 10);
        window.sounds.playOnce(window.sounds.BACKGROUND_GAME, elementToControl);
    } else if (htmlDiv === 'canvasControlMenu') {
        if (typeof world !== 'undefined' && world && world.endbossMet) {
            window.sounds.playLoop(window.sounds.BACKGROUND_ENDBOSS, elementToControl);
        } else {
            window.sounds.playLoop(window.sounds.BACKGROUND_GAME, elementToControl);
        }
    }
}

/**
 * Toggles mute state and updates UI and audio.
 * @param {string} htmlDiv - The container element id.
 * @param {'effect'|'music'} elementToControl - The audio type to control.
 * @param {Event} ev - The triggering event.
 */
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

/**
 * Blurs the triggering element and stops event propagation.
 * @param {Event} ev - The triggering event.
 */
function eventBlurAndStopPropagation(ev) {
    ev.currentTarget.blur();
    ev.stopPropagation();
}

/**
 * Updates the volume bar width in the UI.
 * @param {string} htmlDiv - The container element id.
 * @param {'effect'|'music'} elementToControl - The audio type to control.
 */
function setVolumeInHTML(htmlDiv, elementToControl) {
    let progressBar = document.getElementById(htmlDiv).querySelector('#' + elementToControl + 'VolumeProgressBar');
    progressBar.style.width = window.sounds.volumeCurrent[elementToControl] * 100 + '%';
}

/**
 * Toggles mute icons for a specific audio type.
 * @param {string} htmlDiv - The container element id.
 * @param {'effect'|'music'|string[]} elementToControl - The audio type or array of types.
 */
function toggleMuteIcons(htmlDiv, elementToControl) {
    if (Array.isArray(elementToControl)) {
        elementToControl.forEach(el => toggleMuteIcons(htmlDiv, el));
        return;
    }
    let [iconON, iconOFF] = ['_on', '_off'].map(suffix => document.getElementById(htmlDiv).querySelector('#' + elementToControl + suffix));
    window.sounds.volumeIsMuted[elementToControl] ? toggleMuteElement(iconOFF, iconON) : toggleMuteElement(iconON, iconOFF);
}

/**
 * Shows the active mute icon and hides the inactive one.
 * @param {HTMLElement} iconON - Icon for active state.
 * @param {HTMLElement} iconOFF - Icon for inactive state.
 */
function toggleMuteElement(iconON, iconOFF) {
    iconON.style.display = 'block';
    iconOFF.style.display = 'none';
}

/**
 * Sets the volume bar to zero and stops preview sounds.
 * @param {string} htmlDiv - The container element id.
 * @param {'effect'|'music'|string[]} elementToControl - The audio type or array of types.
 */
function setVolumeBarToZero(htmlDiv, elementToControl) {
    if (Array.isArray(elementToControl)) {
        elementToControl.forEach(el => setVolumeBarToZero(htmlDiv, el));
        return;
    }
    let progressBar = document.getElementById(htmlDiv).querySelector('#' + elementToControl + 'VolumeProgressBar');
    elementToControl === 'effect' ? window.sounds.stop(window.sounds.MENU_CLICK) : window.sounds.stop(window.sounds.BACKGROUND_GAME);
    progressBar.style.width = '0%';
}

/**
 * Toggles the mute boolean for a specific audio type.
 * @param {'effect'|'music'} elementToControl - The audio type to control.
 */
function toggleVolumeMuteBoolean(elementToControl) {
    window.sounds.volumeIsMuted[elementToControl] ? setvolumeIsMuted(elementToControl, false) : setvolumeIsMuted(elementToControl, true);
    return;
}

/**
 * Sets the mute state for a specific audio type.
 * @param {'effect'|'music'} elementToControl - The audio type to control.
 * @param {boolean} bool - The mute value.
 * @returns {boolean} The updated mute state.
 */
function setvolumeIsMuted(elementToControl, bool) {
    window.sounds.volumeIsMuted[elementToControl] = bool;
    return window.sounds.volumeIsMuted[elementToControl];
}

/**
 * Updates mute icons for a list of audio types.
 * @param {string} htmlDiv - The container element id.
 * @param {string[]} array - Array of audio types.
 */
function diplayAccordingMuteUnmuteVolumeIcons(htmlDiv, array) {
    toggleMuteIcons(htmlDiv, array);
}
