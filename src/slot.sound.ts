import { Howl, Howler } from 'howler';

export class SlotSound {
    private startSnd: Howl;
    private stopSnd: Howl;
    private isPlaying = false;

    constructor(volume: number) {
        Howler.volume(volume);
    }

    createSound() {
        this.startSnd = new Howl({
            src: ['assets/reelspin.mp3']
        });

        this.stopSnd = new Howl({
            src: ['assets/landing.mp3']
        });
    }

    play() {
        this.startSnd.play();
        this.isPlaying = true;
    }

    stop() {
        if ( this.isPlaying ) {
            this.startSnd.stop();
        }

        this.stopSnd.play();
    }
}