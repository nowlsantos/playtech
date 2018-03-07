
export class SlotSprite {
    sprite: PIXI.Sprite;
    hasFilter = false;
    private bg: PIXI.Sprite;
    private blurFilter: PIXI.filters.BlurFilter;

    constructor(public container: PIXI.Sprite) {
        this.blurFilter = new PIXI.filters.BlurFilter();
    }

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

    addFilter() {
        this.sprite.filters = [this.blurFilter];
        this.hasFilter = true;

        const blurAmount = Math.cos(3);
        this.blurFilter.blur = 3 * (blurAmount);
    }

    removeFilter() {
        this.sprite.filters = null;
        this.hasFilter = false;
    }
}