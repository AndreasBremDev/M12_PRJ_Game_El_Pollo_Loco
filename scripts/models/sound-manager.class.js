/**
 * Handles all game audio, including music and sound effects.
 */
class Sounds {

    /**
     * Creates a new Sounds instance and initializes all audio objects.
     */
    constructor() {
        this.volumeIsMuted = {
            'effect': true,
            'music': true
        };
        this.volumeCurrent = {
            'effect': 0.2,
            'music': 0.2
        };
        this.canPlayHandlers = new WeakMap();

        this.BACKGROUND_GAME = new Audio('./assets/audio/background_game.m4a');
        this.BACKGROUND_ENDBOSS = new Audio('./assets/audio/background_endboss.m4a');
        this.ENDGAME_WIN = new Audio('./assets/audio/screen_WIN_win-2.m4a');
        this.ENDGAME_LOOSE = new Audio('./assets/audio/screen_LOOSE_4s.m4a');

        this.BOTTLE_SPLASH = new Audio('./assets/audio/bottle_splash_2.m4a');
        this.BOTTLE_SQUEEZE = new Audio('./assets/audio/bottle_squeeze.m4a');
        this.BOTTLE_THROW = new Audio('./assets/audio/bottle_throw_1.m4a');

        this.CHARACTER_CROUCHING = new Audio('./assets/audio/character_crouching.m4a');
        this.CHARACTER_DEAD = new Audio('./assets/audio/character_dead.m4a');
        this.CHARACTER_HURT = new Audio('./assets/audio/character_hurt.m4a');
        this.CHARACTER_JUMP = new Audio('./assets/audio/character_jump.m4a');
        this.CHARACTER_LONG_IDLE = new Audio('./assets/audio/character_long_idle.m4a');
        this.CHARACTER_WALK = new Audio('./assets/audio/character_walk1.m4a');

        this.CHICKEN_DEAD = new Audio('./assets/audio/chicken_dead.m4a');
        this.CHICKEN_DEAD_2 = new Audio('./assets/audio/chicken_dead_2.m4a');
        this.CHICKEN_NORMAL = new Audio('./assets/audio/chicken_gacker_gacker_medium.m4a');

        this.CHICKEN_ENDBOSS_ALERT = new Audio('./assets/audio/chicken_Endboss_alert_gack_gack_gaaaack_medium.m4a');
        this.CHICKEN_ENDBOSS_ATTACK = new Audio('./assets/audio/chicken_Endboss_attack_gack_gaaaack_loud.m4a');
        this.CHICKEN_ENDBOSS_DEAD = new Audio('./assets/audio/chicken_Endboss_dead_1.m4a');
        this.CHICKEN_ENDBOSS_HURT = new Audio('./assets/audio/chicken_Endboss_hurt_gack_gaaaack_loud.m4a');

        this.CHICKEN_SMALL = new Audio('./assets/audio/chicken_small_chirp.m4a');
        this.CHICKEN_SMALL_DEAD = new Audio('./assets/audio/chicken_small_dead.m4a');

        this.COLLECT_BOTTLE = new Audio('./assets/audio/collect_bottle.m4a');
        this.COLLECT_COIN = new Audio('./assets/audio/collect_coin.m4a');

        this.MENU_CLICK = new Audio('./assets/audio/menu_click.m4a');

        this.musicArray = [
            this.BACKGROUND_GAME,
            this.BACKGROUND_ENDBOSS,
        ];
        
        this.effectArray = [
            this.BOTTLE_SPLASH,
            this.BOTTLE_SQUEEZE,
            this.BOTTLE_THROW,
            this.CHARACTER_CROUCHING,
            this.CHARACTER_DEAD,
            this.CHARACTER_HURT,
            this.CHARACTER_JUMP,
            this.CHARACTER_LONG_IDLE,
            this.CHARACTER_WALK,
            this.CHICKEN_DEAD,
            this.CHICKEN_DEAD_2,
            this.CHICKEN_NORMAL,
            this.CHICKEN_ENDBOSS_ALERT,
            this.CHICKEN_ENDBOSS_ATTACK,
            this.CHICKEN_ENDBOSS_DEAD,
            this.CHICKEN_ENDBOSS_HURT,
            this.CHICKEN_SMALL,
            this.CHICKEN_SMALL_DEAD,
            this.COLLECT_BOTTLE,
            this.COLLECT_COIN,
            this.MENU_CLICK,
            this.ENDGAME_WIN_1,
            this.ENDGAME_WIN,
            this.ENDGAME_LOOSE
        ];
    }

    /**
     * Plays an audio object once if not muted.
     * @param {HTMLAudioElement} audioObj - The audio object to play.
     * @param {'effect'|'music'} [elementToControl='effect'] - The type of audio content.
     */
    playOnce(audioObj, elementToControl = 'effect') {
        if (this.volumeIsMuted[elementToControl]) {
            return;
        } else {
            audioObj.volume = this.volumeCurrent[elementToControl];
            audioObj.currentTime = 0;
            audioObj.loop = false
            this.checkReadyStateAndPlay(audioObj, 'play');
        }
    }

    /**
     * Plays an audio object in a loop if not muted.
     * @param {HTMLAudioElement} audioObj - The audio object to play.
     * @param {'effect'|'music'} [elementToControl='effect'] - The type of audio content.
     */
    playLoop(audioObj, elementToControl = 'effect') {
        if (this.volumeIsMuted[elementToControl] || this.isGameOver) { /// noch nirgends als variable gesetzt
            return;
        } else {
            audioObj.volume = this.volumeCurrent[elementToControl];
            audioObj.loop = true;
            this.checkReadyStateAndPlay(audioObj);
        }
    }

    /**
     * Pauses an audio object.
     * @param {HTMLAudioElement} audioObj - The audio object to pause.
     */
    pause(audioObj) {
        try {
            this.checkReadyStateAndPlay(audioObj, 'pause');
        } catch (e) {
            console.log('Audio konnte nicht pausiert werden.', e, audioObj);
        }
    }

    /**
     * Checks if audio is ready to play or needs to be paused.
     * @param {HTMLAudioElement} audioObj - The audio object.
     * @param {'play'|'pause'} [action='play'] - The action to perform.
     */
    checkReadyStateAndPlay(audioObj, action = 'play') {
        if (action === 'pause') {
            this.detachCanPlayHandler(audioObj);
            audioObj.pause();
            return;
        }
        if (audioObj.readyState >= 4) {
            // audioObj.play();
            audioObj.play().catch(err => console.warn('play blocked', err, audioObj));
        } else {
            this.detachCanPlayHandler(audioObj);
            let handler = () => audioObj.play().catch(err => console.warn('play blocked', err, audioObj));
            this.canPlayHandlers.set(audioObj, () => audioObj.play());
            audioObj.addEventListener('canplaythrough', handler /* this.canPlayHandlers.get(audioObj) */, { once: true });
            audioObj.load();
        }
    }

    /**
     * Applies the current mute state to all audio objects of a specific type.
     * @param {'effect'|'music'} type - The type of audio content.
     */
    applyMuteState(type) {
        const targets = type === 'music' ? this.musicArray : this.effectArray;
        targets.forEach(audio => audio && (audio.muted = this.volumeIsMuted[type]));
    }

    /**
     * Stops an audio object and resets its position.
     * @param {HTMLAudioElement} audioObj - The audio object to stop.
     */
    stop(audioObj) {
        this.detachCanPlayHandler(audioObj);
        audioObj.pause();
        audioObj.currentTime = 0;
        audioObj.loop = false;
    }

    /**
     * Removes the canplaythrough event handler for an audio object.
     * @param {HTMLAudioElement} audioObj - The audio object.
     */
    detachCanPlayHandler(audioObj) {
        const handler = this.canPlayHandlers.get(audioObj);
        if (handler) {
            audioObj.removeEventListener('canplaythrough', handler);
            this.canPlayHandlers.delete(audioObj);
        }
    }

    /**
     * Mutes an audio object.
     * @param {HTMLAudioElement} audioObj - The audio object.
     */
    mute(audioObj) {
        audioObj.muted = true;
    }

    /**
     * Unmutes an audio object.
     * @param {HTMLAudioElement} audioObj - The audio object.
     */
    unmute() {
        audioObj.muted = false;
    }

}