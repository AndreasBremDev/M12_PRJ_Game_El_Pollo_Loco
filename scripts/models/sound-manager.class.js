class Sounds {

    constructor(src, volume = 0.2, loop = false) {
        this.audio = new Audio(src);
        this.audio.volume = volume;
        this.audio.loop = loop;
    }

    play() {
        this.audio.currentTime = 0;
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    setVolume(volume) {
        this.audio.volume = volume;
    }

    mute() {
        this.audio.muted = true;
    }

    unmute() {
        this.audio.muted = false;
    }
}