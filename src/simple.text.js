"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleText = (function (_super) {
    __extends(SimpleText, _super);
    function SimpleText() {
        return _super.call(this) || this;
    }
    SimpleText.prototype.addStyle = function (font, size, weight, fill) {
        var style = new PIXI.TextStyle({
            fontFamily: font,
            fontSize: size,
            fontWeight: weight,
            fill: fill,
            align: 'center'
        });
        return style;
    };
    SimpleText.prototype.update = function (count) {
        this.text = "" + count;
    };
    return SimpleText;
}(PIXI.Text));
exports.SimpleText = SimpleText;
