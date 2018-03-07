export class ArrowDirection {
    private sprite: PIXI.Sprite;

    constructor(public container: PIXI.Container, frameId: string) {
        this.setup(frameId)
    }
    
    private setup(id: string) {
        this.sprite = PIXI.Sprite.fromFrame(id);
        this.container.addChild(this.sprite);
    }

    setPosition(x: number, y: number) {
        this.sprite.position.set(x, y);
    }
}