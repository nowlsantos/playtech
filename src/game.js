"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var scaleManager_1 = require("./scaleManager");
var frame_sprite_1 = require("./frame.sprite");
var arrow_sprite_1 = require("./arrow.sprite");
var spin_button_1 = require("./spin.button");
var signal_1 = require("./signal");
var slot_container_1 = require("./slot.container");
var slot_sound_1 = require("./slot.sound");
var SlotMachine = (function () {
    function SlotMachine(w, h, color) {
        this.slotContainers = [];
        this.app = new PIXI.Application(w, h, { backgroundColor: color });
        document.body.appendChild(this.app.view);
    }
    SlotMachine.prototype.initialize = function () {
        var _this = this;
        var loader = new PIXI.loaders.Loader();
        loader.add('slots', 'assets/slotmachine.json')
            .add('background', 'assets/background.jpg');
        loader.on("progress", function (loader, resources) {
            _this.loadProgressHandler(loader.resources);
        });
        loader.once("complete", function (loader, resources) {
            _this.loadComplete(loader.resources);
        });
        loader.load(function (loader, resources) {
            _this.onAssetLoaded(loader.resources);
        });
    };
    SlotMachine.prototype.loadProgressHandler = function (resources) {
    };
    SlotMachine.prototype.loadComplete = function (resources) {
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
    };
    SlotMachine.prototype.onAssetLoaded = function (resources) {
        var nwidth = this.app.renderer.width;
        var nheight = this.app.renderer.height;
        var slots = this.getStripNames(resources);
        var bg = PIXI.Sprite.fromImage('assets/background.jpg');
        this.container.addChild(bg);
        var rectBg = new PIXI.Graphics();
        rectBg.beginFill(0xFFFFFF, 0.7);
        rectBg.drawRoundedRect(80, 20, 1100, 630, 16);
        rectBg.endFill();
        this.container.addChild(rectBg);
        var SLOT_WIDTH = 210;
        for (var n = 0; n < 5; n++) {
            this.slotContainer = new slot_container_1.SlotContainer(new PIXI.Container(), n * 0.2);
            this.container.addChild(this.slotContainer.container);
            this.slotContainer.initialize(slots, SLOT_WIDTH + (n % 5) * SLOT_WIDTH, 120);
            this.slotContainer.hasSignal = false;
            this.slotContainers.push(this.slotContainer);
        }
        var lastSlotCont = this.slotContainers[this.slotContainers.length - 1];
        lastSlotCont.addSignal();
        lastSlotCont.signal.add(this.slotContainerSignalHandler, this);
        var frame = new frame_sprite_1.FrameBorder(new PIXI.Container(), 'frame_border.png');
        frame.container.position.set(this.container.width / 2 - frame.sprite.getBounds().width / 2, 10);
        this.container.addChild(frame.container);
        var arrow = new arrow_sprite_1.ArrowDirection(new PIXI.Container(), 'arrow_direction.png');
        arrow.setPosition(20, window.innerHeight - arrow.container.getBounds().height);
        this.container.addChild(arrow.container);
        this.spinButton = new spin_button_1.SpinButton(new PIXI.Container(), new signal_1.Signal());
        this.spinButton.initialize(slots);
        this.spinButton.setPosition(window.innerWidth - this.spinButton.container.getBounds().width * 2, window.innerHeight - this.spinButton.container.getBounds().height - 30);
        this.spinButton.makeInteractive();
        this.spinButton.signal.add(this.spinHandler, this);
        this.container.addChild(this.spinButton.container);
        this.slotSound = new slot_sound_1.SlotSound(6);
        this.slotSound.createSound();
        var scaleManager = new scaleManager_1.ScaleManager(this.app);
        scaleManager.initialize();
        scaleManager.resize(nwidth, nheight);
        window.addEventListener('resize', function (event) {
            scaleManager.resize(nwidth, nheight);
        });
    };
    SlotMachine.prototype.spinHandler = function (params) {
        for (var _i = 0, _a = this.slotContainers; _i < _a.length; _i++) {
            var container = _a[_i];
            container.spin();
        }
    };
    SlotMachine.prototype.slotContainerSignalHandler = function (params) {
        switch (params[0]) {
            case 'start':
                this.slotSound.play();
                break;
            case 'stop':
                this.slotSound.stop();
                break;
            default: null;
        }
        this.spinButton.isPressed = false;
        this.spinButton.enabled(true);
        if (this.spinButton.isHover) {
            this.spinButton.sprite.texture = this.spinButton.textureHover;
        }
    };
    SlotMachine.prototype.getStripNames = function (resources) {
        var data = resources.slots.data.frames;
        var result = Object.keys(data).map(function (key) {
            return [(key), data[key]];
        });
        var icons = [];
        for (var n = 0; n < result.length; n++) {
            icons.push(result[n][0]);
        }
        return icons;
    };
    return SlotMachine;
}());
exports.SlotMachine = SlotMachine;
