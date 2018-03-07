"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SlotSprite = (function () {
    function SlotSprite(container) {
        this.container = container;
        this.hasFilter = false;
        this.blurFilter = new PIXI.filters.BlurFilter();
    }
    SlotSprite.prototype.initialize = function (bgId, frameId) {
        this.bg = PIXI.Sprite.fromFrame(bgId);
        this.bg.anchor.set(0.5, 0.5);
        this.sprite = PIXI.Sprite.fromFrame(frameId);
        this.sprite.anchor.set(0.5, 0.5);
        this.container.addChild(this.bg, this.sprite);
    };
    SlotSprite.prototype.setPosition = function (x, y) {
        this.container.position.set(x, y);
    };
    SlotSprite.prototype.addFilter = function () {
        this.sprite.filters = [this.blurFilter];
        this.hasFilter = true;
        var blurAmount = Math.cos(3);
        this.blurFilter.blur = 3 * (blurAmount);
    };
    SlotSprite.prototype.removeFilter = function () {
        this.sprite.filters = null;
        this.hasFilter = false;
    };
    return SlotSprite;
}());
exports.SlotSprite = SlotSprite;
