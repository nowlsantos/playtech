
import * as PIXI from 'pixi.js';
import { ScaleManager } from './scaleManager';
import { FrameBorder } from './frame.sprite';
import { ArrowDirection } from './arrow.sprite';
import { SpinButton } from './spin.button';
import { Signal } from './signal';
import { SlotContainer } from './slot.container';
import { SlotSound } from './slot.sound';

export class SlotMachine {
    app: PIXI.Application;

    private container: PIXI.Container;
    private slotContainer: SlotContainer;
    private spinButton: SpinButton;
    private slotContainers: SlotContainer[] = [];

    private slotSound: SlotSound;

    constructor(w: number, h: number, color: number) {
        this.app = new PIXI.Application( w, h, { backgroundColor: color });
        document.body.appendChild(this.app.view);
    }

    initialize() {
        //console.log('initialize');
        const loader = new PIXI.loaders.Loader();
        loader.add('slots', 'assets/slotmachine.json')
              .add('background', 'assets/background.jpg');

        loader.on("progress", (loader: PIXI.loaders.Loader, resources: PIXI.loaders.Resource) => {
            this.loadProgressHandler(loader.resources);
        });
        
        loader.once("complete", (loader: PIXI.loaders.Loader, resources: PIXI.loaders.Resource) => {
            this.loadComplete(loader.resources);
        });

        loader.load( (loader: PIXI.loaders.Loader, resources: PIXI.loaders.Resource) => {
            this.onAssetLoaded(loader.resources);
        });
    }
    loadProgressHandler(resources: PIXI.loaders.ResourceDictionary) {
        //---handle the preloading animation here---
        //console.log('loadProgressHandler');
    }

    loadComplete(resources: PIXI.loaders.ResourceDictionary) {
        //console.log("loadComplete");
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
    }

    onAssetLoaded(resources: PIXI.loaders.ResourceDictionary) {
        //console.log("Asset Loaded");
        const nwidth = this.app.renderer.width;
        const nheight = this.app.renderer.height;
        
        //---String representation in JSON---
        const slots = this.getStripNames(resources);
        
        //---Background Image---
        const bg = PIXI.Sprite.fromImage('assets/background.jpg');
        this.container.addChild(bg);

        const rectBg = new PIXI.Graphics();
        rectBg.beginFill(0xFFFFFF, 0.7);
        rectBg.drawRoundedRect(80, 20, 1100, 630, 16);
        rectBg.endFill();
        this.container.addChild(rectBg);
        
        /* DEBUG 
        this.slotContainer = new SlotContainer(new PIXI.Container(), new Signal());
        this.container.addChild(this.slotContainer.container);
        this.slotContainer.initialize(slots, 210, 120);
        this.slotContainer.signal.add(this.slotContainerSignalHandler, this); 
        */
        
        //---Slot Container---
        const SLOT_WIDTH = 210;
        for ( let n = 0; n < 5; n++ ) {
            this.slotContainer = new SlotContainer(new PIXI.Container(), n * 0.2);
            this.container.addChild(this.slotContainer.container);
            this.slotContainer.initialize(slots, SLOT_WIDTH + ( n % 5) * SLOT_WIDTH, 120);
            this.slotContainer.hasSignal = false;
            this.slotContainers.push(this.slotContainer);
        }
        const lastSlotCont = this.slotContainers[this.slotContainers.length-1];
        lastSlotCont.addSignal();
        lastSlotCont.signal.add(this.slotContainerSignalHandler, this);

        //---Frame Border---
        const frame = new FrameBorder(new PIXI.Container(), 'frame_border.png');
        frame.container.position.set(this.container.width/2 - frame.sprite.getBounds().width/2, 10)
        this.container.addChild(frame.container);

        //---Arrow Image---
        const arrow = new ArrowDirection(new PIXI.Container(),'arrow_direction.png');
        arrow.setPosition(20, window.innerHeight-arrow.container.getBounds().height);
        this.container.addChild(arrow.container);
    
        //---Spin Button---
        this.spinButton = new SpinButton(new PIXI.Container(), new Signal());
        this.spinButton.initialize(slots);
        this.spinButton.setPosition(
            window.innerWidth - this.spinButton.container.getBounds().width * 2,
            window.innerHeight - this.spinButton.container.getBounds().height - 30
        );
        this.spinButton.makeInteractive();
        this.spinButton.signal.add(this.spinHandler, this);
        this.container.addChild(this.spinButton.container);

        //---create the audios---
        this.slotSound = new SlotSound(6);
        this.slotSound.createSound();
        
        //---Scale the appliccation on resize---h
        const scaleManager = new ScaleManager(this.app);
        scaleManager.initialize();
        scaleManager.resize(nwidth, nheight);
        
        window.addEventListener('resize', (event) => {
            scaleManager.resize(nwidth, nheight);
        }); 
    }

    protected spinHandler(params: any[]) {
        for ( let container of this.slotContainers ) {
            container.spin();
        }
    }

    protected slotContainerSignalHandler(params: any[]) {
        switch ( params[0]){
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

        if ( this.spinButton.isHover ) {
            this.spinButton.sprite.texture = this.spinButton.textureHover;
        }
    }

    private getStripNames(resources: PIXI.loaders.ResourceDictionary): string[] {
        const data = resources.slots.data.frames;
        const result = Object.keys(data).map((key: string) => {
            return [<string>(key), data[key]];
        });
    
        let icons: string[] = [];
        for ( let n = 0; n < result.length; n++ ) {
            icons.push(result[n][0]);
        }
        
        return icons;
    }
}