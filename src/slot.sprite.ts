
export class SlotSprite {
    sprite: PIXI.Sprite;
    hasFilter = false;
    private bg: PIXI.Sprite;
    
    constructor(public container: PIXI.Sprite) {}

    initialize(bgId: string, frameId: string) {
        this.bg = PIXI.Sprite.fromFrame(bgId);
        this.bg.anchor.set(0.5, 0.5);
        
        this.sprite = PIXI.Sprite.fromFrame(frameId);
        this.sprite.anchor.set(0.5, 0.5);

        this.container.addChild(this.bg, this.sprite);
    }

    setPosition(x: number, y: number) {
        this.container.position.set(x, y);
    }
}