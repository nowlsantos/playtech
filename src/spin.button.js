"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpinButton = (function () {
    function SpinButton(container, signal) {
        this.container = container;
        this.signal = signal;
        this.buttons = [];
        this.isHover = false;
        this.isPressed = false;
    }
    SpinButton.prototype.initialize = function (slots) {
        for (var n = 0; n < slots.length; n++) {
            var buttonFilter = this.buttonFilter(slots[n], n, slots);
            if (buttonFilter) {
                this.buttons.push(slots[n]);
            }
        }
        this.textureDisabled = PIXI.Texture.fromFrame(this.buttons[0]);
        this.textureHover = PIXI.Texture.fromFrame(this.buttons[1]);
        this.textureNormal = PIXI.Texture.fromFrame(this.buttons[2]);
        this.sprite = new PIXI.Sprite(this.textureNormal);
        this.container.addChild(this.sprite);
    };
    SpinButton.prototype.setPosition = function (x, y) {
        this.sprite.position.set(x, y);
    };
    SpinButton.prototype.makeInteractive = function () {
        var _this = this;
        this.sprite.buttonMode = true;
        this.sprite.interactive = true;
        this.sprite.on('pointerdown', function (event) {
            _this.spritePressedHandler(event);
        });
        this.sprite.on('pointerup', function (event) {
            _this.spriteUpHandler(event);
        });
        this.sprite.on('pointerupoutside', function (event) {
            _this.spriteUpHandler(event);
        });
        this.sprite.on('pointerover', function (event) {
            _this.spriteHoverHandler(event);
        });
        this.sprite.on('pointerout', function (event) {
            _this.spriteOutHandler(event);
        });
    };
    SpinButton.prototype.enabled = function (flag) {
        this.sprite.interactive = this.sprite.buttonMode = flag;
        return flag;
    };
    SpinButton.prototype.spritePressedHandler = function (event) {
        this.isPressed = true;
        this.sprite.texture = this.textureDisabled;
        this.enabled(false);
        this.signal.dispatch(this);
    };
    SpinButton.prototype.spriteUpHandler = function (event) {
        if (this.isPressed)
            return;
        this.isPressed = false;
        if (this.isHover) {
            this.sprite.texture = this.textureHover;
        }
        else {
            this.sprite.texture = this.textureNormal;
        }
    };
    SpinButton.prototype.spriteHoverHandler = function (event) {
        this.isHover = true;
        if (this.isPressed)
            return;
        this.sprite.texture = this.textureHover;
    };
    SpinButton.prototype.spriteOutHandler = function (event) {
        this.isHover = false;
        if (this.isPressed)
            return;
        this.sprite.texture = this.textureNormal;
    };
    SpinButton.prototype.buttonFilter = function (element, index, arr) {
        return element.includes('button');
    };
    return SpinButton;
}());
exports.SpinButton = SpinButton;
