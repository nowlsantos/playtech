"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var howler_1 = require("howler");
var SlotSound = (function () {
    function SlotSound(volume) {
        this.isPlaying = false;
        howler_1.Howler.volume(volume);
    }
    SlotSound.prototype.createSound = function () {
        this.startSnd = new howler_1.Howl({
            src: ['assets/reelspin.mp3']
        });
        this.stopSnd = new howler_1.Howl({
            src: ['assets/landing.mp3']
        });
    };
    SlotSound.prototype.play = function () {
        this.startSnd.play();
        this.isPlaying = true;
    };
    SlotSound.prototype.stop = function () {
        if (this.isPlaying) {
            this.startSnd.stop();
        }
        this.stopSnd.play();
    };
    return SlotSound;
}());
exports.SlotSound = SlotSound;
