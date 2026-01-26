function topSectionStandardTemplate() {
    return /* html */`
        <button id="btnTitle" class="epl-btn" onclick="showMenuTab('title', titleBg)">TITLE</button>
        <button id="btnStory" class="epl-btn" onclick="showMenuTab('story')">STORY</button>
        <button id="btnControls" class="epl-btn" onclick="showMenuTab('controls')">CONTROLS</button>
        <button id="btnSound" class="epl-btn" onclick="showMenuTab('sounds')">SOUND</button>`
}

function bottomSectionStandardTemplate() {
    return /* html */`
        <button id="btnPlay" class="epl-btn epl-btn-imprint epl-btn-animated" onclick="playGame()">PLAY</button>
        <button id="btnImprint" class="epl-btn epl-btn-imprint">IMPRINT</button>`;
}

function topSectionGameoverWinTemplate() {
    return /* html */`
        <button id="btnTitle" class="epl-btn" onclick="showMenuTab('title', titleBg)">TITLE</button>`
}

function bottomSectionGameoverWinTemplate() {
    return /* html */`
        <button id="btnPlay" class="epl-btn epl-btn-imprint epl-btn-animated" onclick="playGame()">REPLAY</button>`;
}