export class FrameBorder {
    sprite: PIXI.Sprite;

    constructor(public container: PIXI.Container, frameId: string) {
        this.setup(frameId)
    }

    private setup(id: string) {
        this.sprite = PIXI.Sprite.fromFrame(id);
        this.container.addChild(this.sprite);
    }

    private createBgGraphics(x: number, y: number, w: number, h: number) {
        const bg = new PIXI.Graphics();
        //bg.lineStyle(8, 0xFFFFFF, 0.5);
        bg.beginFill(0xFFFFFF, 0.4);
        bg.drawRect(x, y, w, h);
        bg.endFill();
        this.sprite.addChild(bg);
    }

    setPosition(x: number, y: number) {
        this.sprite.position.set(x, y);
    }
}