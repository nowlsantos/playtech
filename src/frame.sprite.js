"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FrameBorder = (function () {
    function FrameBorder(container, frameId) {
        this.container = container;
        this.setup(frameId);
    }
    FrameBorder.prototype.setup = function (id) {
        this.sprite = PIXI.Sprite.fromFrame(id);
        this.container.addChild(this.sprite);
    };
    FrameBorder.prototype.createBgGraphics = function (x, y, w, h) {
        var bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF, 0.4);
        bg.drawRect(x, y, w, h);
        bg.endFill();
        this.sprite.addChild(bg);
    };
    FrameBorder.prototype.setPosition = function (x, y) {
        this.sprite.position.set(x, y);
    };
    return FrameBorder;
}());
exports.FrameBorder = FrameBorder;
