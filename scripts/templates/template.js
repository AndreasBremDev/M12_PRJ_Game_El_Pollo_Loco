/**
 * Builds the top section buttons for the standard menu.
 * @returns {string} HTML string for the top section.
 */
function topSectionStandardTemplate() {
    return /* html */`
        <button id="btnTitle" class="epl-btn epl-btn-padding" onclick="showMenuTab('title', titleBg)">TITLE</button>
        <button id="btnStory" class="epl-btn epl-btn-padding" onclick="showMenuTab('story')">STORY</button>
        <button id="btnControls" class="epl-btn epl-btn-padding" onclick="showMenuTab('controls')">CONTROLS</button>
        <button id="btnSound" class="epl-btn epl-btn-padding" onclick="showMenuTab('sounds')">SOUND</button>`
}

/**
 * Builds the bottom section buttons for the standard menu.
 * @returns {string} HTML string for the bottom section.
 */
function bottomSectionStandardTemplate() {
    return /* html */`
        <button id="btnPlay" class="epl-btn epl-btn-padding epl-btn-imprint epl-btn-animated" onclick="playGame()">PLAY</button>
        <button id="btnImprint" class="epl-btn epl-btn-padding epl-btn-imprint" onclick="showMenuTab('imprint')">IMPRINT</button>`;
}

/**
 * Builds the top section buttons for the win screen.
 * @returns {string} HTML string for the top section.
 */
function topSectionGameoverWinTemplate() {
    return /* html */`
        <button id="btnTitle" class="epl-btn epl-btn-padding" onclick="showMenuTab('title', titleBg)">TITLE</button>`
}

/**
 * Builds the bottom section buttons for the win screen.
 * @returns {string} HTML string for the bottom section.
 */
function bottomSectionGameoverWinTemplate() {
    return /* html */`
        <button id="btnPlay" class="epl-btn epl-btn-padding epl-btn-imprint epl-btn-animated" onclick="playGame()">REPLAY</button>`;
}