"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slot_sprite_1 = require("./slot.sprite");
var gsap_1 = require("gsap");
var signal_1 = require("./signal");
var SlotContainer = (function () {
    function SlotContainer(container, delay) {
        this.container = container;
        this.delay = delay;
        this.slots = [];
        this.hasSignal = false;
        this.SLOT_WIDTH = 212;
        this.SLOT_SIZE = 145;
        this.strips = [];
        this.allSlots = [];
    }
    SlotContainer.prototype.initialize = function (slots, x, y) {
        var len = slots.length;
        for (var n = 0; n < len; n++) {
            var slotFilter = this.slotFilter(slots[n], n, slots);
            if (slotFilter) {
                this.slots.push(slots[n]);
            }
        }
        this.masker = this.createMask(x - 105, y - 80);
        this.container.addChild(this.masker);
        var count = this.slots.length;
        this.STRIP_HEIGHT = count * this.SLOT_SIZE;
        this.setup(x, y, 'strip_1');
        this.setup(x, y - this.STRIP_HEIGHT, 'strip_2');
    };
    SlotContainer.prototype.setup = function (x, y, id) {
        var holder = new PIXI.Sprite();
        holder.name = id;
        this.shuffle(this.slots);
        var slotlen = this.slots.length;
        for (var n = 0; n < slotlen; n++) {
            var slot = new slot_sprite_1.SlotSprite(new PIXI.Sprite());
            slot.initialize('frame_bg.png', this.slots[n]);
            slot.setPosition(x, y + (n % slotlen) * 145);
            slot.sprite.name = this.slots[n];
            holder.addChild(slot.container);
            this.allSlots.push(slot);
        }
        this.strips.push(holder);
        this.container.addChild(holder);
        holder.mask = this.masker;
    };
    SlotContainer.prototype.addSignal = function () {
        this.signal = new signal_1.Signal();
        this.hasSignal = true;
    };
    SlotContainer.prototype.setPosition = function (x, y) {
        this.container.position.set(x, y);
    };
    SlotContainer.prototype.spin = function () {
        if (this.hasSignal) {
            this.signal.dispatch(['start']);
        }
        var index = this.randomIntFromInterval(5, 12);
        var ypos = index * this.SLOT_SIZE + this.STRIP_HEIGHT;
        gsap_1.TweenLite.to(this.strips, 2, {
            y: ypos,
            delay: this.delay,
            ease: gsap_1.Elastic.easeOut.config(0.12, 0.15),
            onUpdate: this.handleUpdate,
            onUpdateParams: [this.strips],
            onUpdateScope: this,
            onComplete: this.handleComplete,
            onCompleteParams: [this.strips],
            onCompleteScope: this
        });
    };
    SlotContainer.prototype.handleUpdate = function (params) {
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var param = params_1[_i];
            if (Math.floor(param.y) > this.STRIP_HEIGHT) {
                var first = params.shift();
                if (first !== undefined) {
                    params.push(first);
                }
                if (first !== param) {
                    var other = param;
                    param.y = Math.floor(other.y) - (this.STRIP_HEIGHT * 2);
                }
            }
        }
    };
    SlotContainer.prototype.handleComplete = function (params) {
        gsap_1.TweenLite.killTweensOf(params);
        var first = params[0];
        var second = params[1];
        switch (true) {
            case first.y === 0:
            case first.y === -this.SLOT_SIZE:
            case Math.floor(second.y) > this.STRIP_HEIGHT:
                second.y = Math.floor(first.y);
                break;
            case Math.floor(first.y) > this.STRIP_HEIGHT:
                first.y = Math.floor(second.y) - this.STRIP_HEIGHT;
                break;
            default: null;
        }
        if (this.hasSignal) {
            this.signal.dispatch(['stop']);
        }
    };
    SlotContainer.prototype.slotFilter = function (element, index, arr) {
        return element.includes('slot');
    };
    SlotContainer.prototype.shuffle = function (arr) {
        var i;
        var j;
        var temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    };
    SlotContainer.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    SlotContainer.prototype.createMask = function (x, y) {
        var graphics = new PIXI.Graphics();
        graphics.name = 'spritemask';
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(x, y, this.SLOT_WIDTH, 580);
        graphics.endFill();
        return graphics;
    };
    return SlotContainer;
}());
exports.SlotContainer = SlotContainer;
