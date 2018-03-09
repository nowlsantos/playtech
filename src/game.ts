
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
    APP_WIDTH: number;
    APP_HEIGHT: number;
    
    private container: PIXI.Container;
    private allSlotContainer: PIXI.Container;
    private lastSlotContainer: SlotContainer;
    private slotContainers: SlotContainer[] = [];
    private spinButton: SpinButton;
    private slotSound: SlotSound;

    constructor(w: number, h: number, color: number) {
        this.app = new PIXI.Application( w, h, { backgroundColor: color });
        document.body.appendChild(this.app.view);
    }

    initialize() {
        //console.log('initialize');
        const loader = new PIXI.loaders.Loader();
        loader.add('slots', 'assets/slotmachine.json')
              //.add('background', 'assets/background.jpg');

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
        this.allSlotContainer = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.container.addChild(this.allSlotContainer);
    }

    onAssetLoaded(resources: PIXI.loaders.ResourceDictionary) {
        //console.log("Asset Loaded");
        this.APP_WIDTH = this.app.renderer.width;
        this.APP_HEIGHT = this.app.renderer.height;
        
        //---String representation in JSON---
        const slots = this.getStripNames(resources);
        
        //---Background Image---
        /* const bg = PIXI.Sprite.fromImage('assets/background.jpg');
        this.container.addChild(bg); */

        /* const rect = new PIXI.Graphics();
        rect.beginFill(0xFF99CC, 0.7);
        rect.drawRoundedRect(this.APP_WIDTH/2-550, 20, 1100, 630, 16);
        rect.endFill();
        this.container.addChild(rect); */
        
        //---Frame Border---
        const frame = new FrameBorder(new PIXI.Container(), 'frame_border.png');
        frame.container.position.set(this.APP_WIDTH/2 - frame.sprite.getBounds().width/2, 10)
        this.container.addChild(frame.container);

        //---Slot Container---
       const SLOT_WIDTH = 210;
       const TOP_POS = 120;
       
       for ( let n = 0; n < 5; n++ ) {
           const slotContainer = new SlotContainer(new PIXI.Container(), n * 0.2);
           this.allSlotContainer.addChild(slotContainer.container);
           
           const posx = (frame.container.x + 30) + SLOT_WIDTH/2 + ( n % 5) * SLOT_WIDTH;
           slotContainer.initialize(slots, posx , TOP_POS);
           this.slotContainers.push(slotContainer);
        }

        //---create a mask for the allslotcontainer---
        const masker = this.createMask(
            SLOT_WIDTH-30, 40, 
            frame.container.width-80, frame.container.height-50    
        )
        this.container.addChild(masker);
        this.allSlotContainer.mask = masker;

        //---we only listen and event to the last container added---
        this.lastSlotContainer = this.slotContainers[this.slotContainers.length-1];
        this.lastSlotContainer.addSignal();
        this.lastSlotContainer.signal.add(this.slotContainerSignalHandler, this);
        
        //---Arrow Image---
        const arrow = new ArrowDirection(new PIXI.Container(),'arrow_direction.png');
        arrow.setPosition(frame.container.x, 
                          this.APP_HEIGHT-arrow.container.getBounds().height + 30);
        this.container.addChild(arrow.container);
    
        //---Spin Button---
        this.spinButton = new SpinButton(new PIXI.Container(), new Signal());
        this.spinButton.initialize(slots);
        this.spinButton.setPosition(
            this.APP_WIDTH - this.spinButton.container.getBounds().width * 2,
            this.APP_HEIGHT - this.spinButton.container.getBounds().height
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
        scaleManager.resize(this.APP_WIDTH, this.APP_HEIGHT);
        
        window.addEventListener('resize', (event) => {
            scaleManager.resize(this.APP_WIDTH, this.APP_HEIGHT);
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

                this.spinButton.isPressed = true;
                this.spinButton.enabled(false);
        
                this.spinButton.sprite.texture = this.spinButton.textureDisabled;
                break;

            case 'stop':
                this.slotSound.stop();
                
                this.spinButton.isPressed = false;
                this.spinButton.enabled(true);
        
                if ( this.spinButton.isHover ) {
                    this.spinButton.sprite.texture = this.spinButton.textureHover;
                }
                break;

            default: null;
        }

    }

    private getStripNames(resources: PIXI.loaders.ResourceDictionary): string[] {
        const data = resources.slots.data.frames;
        const result = Object.keys(data).map((key: string) => {
            return [<string>(key), data[key]];
        });
    
        let strips: string[] = [];
        for ( let n = 0; n < result.length; n++ ) {
            strips.push(result[n][0]);
        }
        
        return strips;
    }

    private createMask(x: number, y: number, w: number, h: number): PIXI.Graphics {
        const graphics = new PIXI.Graphics();
        graphics.name = 'spritemask';
        graphics.beginFill(0xFF99CC, 0.5);
        graphics.drawRect(x, y, w, h);
        graphics.endFill();
        return graphics;
    }
}