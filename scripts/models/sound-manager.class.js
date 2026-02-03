class Sounds {
    constructor() {
        this.volumeMuted = {
            'effect': true,
            'music': true
        };
        this.volumeCurrent = {
            'effect': 0.2,
            'music': 0.2
        };

        this.BACKGROUND_GAME = new Audio('./assets/audio/background_game.m4a');
        this.BACKGROUND_ENDBOSS = new Audio('./assets/audio/background_endboss.m4a');

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

        this.ENDGAME_WIN_1 = new Audio('./assets/audio/screen_WIN_tadaa_1.m4a');
        this.ENDGAME_WIN_2 = new Audio('./assets/audio/screen_WIN_win-2.m4a');
        this.ENDGAME_LOOSE = new Audio('./assets/audio/screen_LOOSE_4s.m4a');

        this.MENU_CLICK = new Audio('./assets/audio/menu_click.m4a');
    }

    playOnce(audioObj, elementToControl = 'effect') {
        if (this.volumeMuted[elementToControl]) {
            return;
        } else {
            audioObj.volume = this.volumeCurrent[elementToControl];
            audioObj.currentTime = 0;
            audioObj.loop = false
            this.checkReadyStateAndPlay(audioObj);
        }
    }
    
    playLoop(audioObj, elementToControl = 'effect') {
        if (this.volumeMuted[elementToControl] || isGameOver) {
            return;
        } else {
            audioObj.volume = this.volumeCurrent[elementToControl];
            audioObj.loop = true;
            this.checkReadyStateAndPlay(audioObj);
        }
    }
    
    pause(audioObj) {
        try {
            audioObj.pause();
        } catch (e) {
            console.log('Audio konnte nicht pausiert werden.', e, audioObj);
        }
    }
    
    checkReadyStateAndPlay(audioObj) {
        if (audioObj.readyState >= 2) {
            audioObj.play();
        } else {
            audioObj.addEventListener('canplaythrough', () => {
                audioObj.play();
            });
        }
    }

    stop(audioObj) {
        audioObj.pause();
        audioObj.currentTime = 0;
        audioObj.loop = false;
    }

    setVolume(audioObj, setVolume = this.generalVolume) {
        audioObj.volume = setVolume;
    }

    // Idee: hintergrundmusik (z.B. wenn Endboss) "spielt" trotz mute "ab", sodass bei unmute direkt die entsprechende stelle abgespielt wird

    mute(audioObj) {
        audioObj.muted = true;
    }

    unmute() {
        audioObj.muted = false;
    }
}