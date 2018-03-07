"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrowDirection = (function () {
    function ArrowDirection(container, frameId) {
        this.container = container;
        this.setup(frameId);
    }
    ArrowDirection.prototype.setup = function (id) {
        this.sprite = PIXI.Sprite.fromFrame(id);
        this.container.addChild(this.sprite);
    };
    ArrowDirection.prototype.setPosition = function (x, y) {
        this.sprite.position.set(x, y);
    };
    return ArrowDirection;
}());
exports.ArrowDirection = ArrowDirection;
