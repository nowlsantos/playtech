import { SlotSprite } from "./slot.sprite";
import { TweenLite, Elastic } from 'gsap';
import { Signal } from "./signal";
import { SimpleText } from "./simple.text";

export class SlotContainer {
    slots: string[] = [];
    STRIP_HEIGHT: number;
    signal: Signal;
    hasSignal = false;

    readonly SLOT_WIDTH = 212;
    readonly SLOT_SIZE = 145;
    private strips: PIXI.Sprite[] =  [];
    private allSlots: SlotSprite[] = [];
    private masker: PIXI.Graphics;

    constructor(public container: PIXI.Container, 
                public delay: number) {}

    initialize(slots: string[], x: number, y: number) {
        //---filter the slots array---
        const len = slots.length;
        for ( let n = 0; n<len; n++ ) {
            const slotFilter = this.slotFilter(slots[n], n, slots);
            if ( slotFilter ) {
                this.slots.push(slots[n]);   
            }
        }
        this.masker = this.createMask(x-105, y-80);
        this.container.addChild(this.masker);
    
        //---arranged a couple of slots container vertically---
        const count = this.slots.length;
        this.STRIP_HEIGHT = count * this.SLOT_SIZE;
        
        this.setup(x, y, 'strip_1');
        this.setup(x, y-this.STRIP_HEIGHT, 'strip_2');
    }

    protected setup(x: number, y: number, id: string) {
        const holder = new PIXI.Sprite();
        holder.name = id;

        //---shuffle the slots array for random arrangement---
        this.shuffle(this.slots);

        const slotlen = this.slots.length;
        for ( let n = 0; n < slotlen; n++ ) {
            const slot = new SlotSprite(new PIXI.Sprite());
            slot.initialize('frame_bg.png', this.slots[n]);
            slot.setPosition(x, y + (n % slotlen) * 145);
            slot.sprite.name = this.slots[n];
            holder.addChild(slot.container);
            this.allSlots.push(slot);

            //DEBUG LOG 
            /* if ( n === 0 ) {
                const txt = new SimpleText();
                txt.text = holder.name + ' : ' + this.slots[0]; 
                txt.style = txt.addStyle('Arial', 20, 'bold', '#000000');
                txt.position.set(-100, 5);
                slot.container.addChild(txt);
            } */
        }
        this.strips.push(holder);
        this.container.addChild(holder);

        holder.mask = this.masker;
    }

    addSignal() {
        this.signal = new Signal();
        this.hasSignal = true;
    }

    setPosition(x: number, y: number) {
        this.container.position.set(x, y);
    }

    spin() {
        if ( this.hasSignal ) {
            this.signal.dispatch(['start']);
        }
        
        const index = this.randomIntFromInterval(5, 12);
        const ypos =  index * this.SLOT_SIZE + this.STRIP_HEIGHT;
        //console.log('INDEX:', index);

        TweenLite.to(this.strips, 2, {
            y: ypos,
            delay: this.delay,
            ease: Elastic.easeOut.config(0.12, 0.15),
            onUpdate: this.handleUpdate,
            onUpdateParams: [this.strips],
            onUpdateScope: this,
            onComplete: this.handleComplete,
            onCompleteParams: [this.strips],
            onCompleteScope: this
        });
    }

    private handleUpdate(params: PIXI.Sprite[]) {
        for ( let param of params ) {
            if ( Math.floor(param.y) > this.STRIP_HEIGHT ) {
                let first = params.shift();
                if ( first !== undefined ) {
                    params.push(first);
                }
                
                if ( first !== param ) {
                    let other = param;
                    param.y = Math.floor(other.y) - (this.STRIP_HEIGHT * 2);
                }
            }
        }
    }

    private handleComplete(params: PIXI.Sprite[]) {
        //console.log('tweencomplete');
        TweenLite.killTweensOf(params);

        const first = params[0];
        const second = params[1];

        switch ( true ) {
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

        if ( this.hasSignal ) {
            this.signal.dispatch(['stop']);
        }
    }
    
    private slotFilter(element: string, index: number, arr: string[]): boolean {
        return element.includes('slot');
    }

    private shuffle(arr: any[]): any[] {
        let i: number;
        let j: number;  
        let temp: any;
    
        for ( i = arr.length - 1; i > 0; i-- ) {
            j = Math.floor(Math.random() * (i + 1) );
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    private randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * ( max - min + 1 ) + min );
    }

    private createMask(x: number, y: number): PIXI.Graphics {
        const graphics = new PIXI.Graphics();
        graphics.name = 'spritemask';
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(x, y, this.SLOT_WIDTH, 580);
        graphics.endFill();
        return graphics;
    }
}