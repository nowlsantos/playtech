import { Signal } from "./Signal";

export class SpinButton {
    buttons: string[] = [];
    sprite: PIXI.Sprite;

    textureNormal: PIXI.Texture;
    textureHover: PIXI.Texture;
    textureDisabled: PIXI.Texture;
    //private texturePressed: PIXI.Texture;
    
    isHover = false;
    isPressed = false;
    
    constructor(public container: PIXI.Container, public signal: Signal) {
    }

    initialize(slots: string[]) {
        for ( let n = 0; n<slots.length; n++ ) {
            const buttonFilter = this.buttonFilter(slots[n], n, slots);
            if ( buttonFilter ) {
                this.buttons.push(slots[n]);   
            }
        }
        
        this.textureDisabled = PIXI.Texture.fromFrame(this.buttons[0]);
        this.textureHover    = PIXI.Texture.fromFrame(this.buttons[1]);
        this.textureNormal   = PIXI.Texture.fromFrame(this.buttons[2]);
        //this.texturePressed  = PIXI.Texture.fromFrame(this.buttons[3]);
        
        this.sprite = new PIXI.Sprite(this.textureNormal);
        this.container.addChild(this.sprite);
    }

    setPosition(x: number, y: number) {
        this.sprite.position.set(x, y);
    }
    
    makeInteractive() {
        this.sprite.buttonMode = true;
        this.sprite.interactive = true;

        this.sprite.on('pointerdown', (event: PIXI.interaction.InteractionEvent) => {
            this.spritePressedHandler(event);
        });

        this.sprite.on('pointerup', (event: PIXI.interaction.InteractionEvent) => {
            this.spriteUpHandler(event);
        });
                   
        this.sprite.on('pointerupoutside', (event: PIXI.interaction.InteractionEvent) => {
            this.spriteUpHandler(event);
        });
        
        this.sprite.on('pointerover', (event: PIXI.interaction.InteractionEvent) => {
            this.spriteHoverHandler(event);
        });
                   
        this.sprite.on('pointerout', (event: PIXI.interaction.InteractionEvent) => {
            this.spriteOutHandler(event);
        });
    }

    enabled(flag: boolean): boolean {
        this.sprite.interactive = this.sprite.buttonMode = flag;
        return flag;
    }

    protected spritePressedHandler(event: PIXI.interaction.InteractionEvent) {
        this.isPressed = true;
        this.sprite.texture = this.textureDisabled;
        this.enabled(false);

        this.signal.dispatch(this);
    }

    protected spriteUpHandler(event: PIXI.interaction.InteractionEvent) {
        if ( this.isPressed ) return;
        this.isPressed = false;

        if ( this.isHover ) {
            this.sprite.texture = this.textureHover;
        } else {
            this.sprite.texture = this.textureNormal;
        }
    }

    protected spriteHoverHandler(event: PIXI.interaction.InteractionEvent) {
        this.isHover = true;
        if ( this.isPressed ) return;

        this.sprite.texture = this.textureHover;
    }

    protected spriteOutHandler(event: PIXI.interaction.InteractionEvent) {
        this.isHover = false;
        if ( this.isPressed ) return;

        this.sprite.texture = this.textureNormal;
    }

    private buttonFilter(element: string, index: number, arr: string[]): boolean {
        return element.includes('button');
    }
}