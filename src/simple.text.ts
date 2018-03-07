
export class SimpleText extends PIXI.Text {
    
    constructor() { 
        super(); 
    }

    addStyle(font: string, size: number, weight: string, fill: string|[string]): PIXI.TextStyle {
        const style = new PIXI.TextStyle({
            fontFamily: font,
            fontSize: size,
            fontWeight: weight,
            fill: fill,
            align: 'center'
        });
        return style;
    }

    update(count: number) {
        this.text = `${count}`;
    }
}