"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScaleManager = (function () {
    function ScaleManager(app) {
        this.app = app;
    }
    ScaleManager.prototype.initialize = function () {
        this.renderer = this.app.renderer;
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.width = window.innerWidth + "px";
        this.renderer.view.style.height = window.innerHeight + "px";
        this.renderer.view.style.display = "block";
    };
    ScaleManager.prototype.resize = function (w, h) {
        this.ratio = Math.min(window.innerWidth / w, window.innerHeight / h);
        this.app.stage.scale.x = this.app.stage.scale.y = this.ratio;
        this.renderer.autoResize = true;
        this.renderer.resize(Math.ceil(w * this.ratio), Math.ceil(h * this.ratio));
    };
    ScaleManager.prototype.getScaleRatio = function () {
        return this.scaleToWindow(this.renderer.view);
    };
    ScaleManager.prototype.scaleToWindow = function (canvas, backgroundColor) {
        var scaleX, scaleY, scale, center;
        scaleX = window.innerWidth / canvas.offsetWidth;
        scaleY = window.innerHeight / canvas.offsetHeight;
        scale = Math.min(scaleX, scaleY);
        canvas.style.transformOrigin = "0 0";
        canvas.style.transform = "scale(" + scale + ")";
        if (canvas.offsetWidth > canvas.offsetHeight) {
            if (canvas.offsetWidth * scale < window.innerWidth) {
                center = "horizontally";
            }
            else {
                center = "vertically";
            }
        }
        else {
            if (canvas.offsetHeight * scale < window.innerHeight) {
                center = "vertically";
            }
            else {
                center = "horizontally";
            }
        }
        var margin;
        if (center === "horizontally") {
            margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
            canvas.style.marginTop = 0 + "px";
            canvas.style.marginBottom = 0 + "px";
            canvas.style.marginLeft = margin + "px";
            canvas.style.marginRight = margin + "px";
        }
        if (center === "vertically") {
            margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
            canvas.style.marginTop = margin + "px";
            canvas.style.marginBottom = margin + "px";
            canvas.style.marginLeft = 0 + "px";
            canvas.style.marginRight = 0 + "px";
        }
        canvas.style.paddingLeft = 0 + "px";
        canvas.style.paddingRight = 0 + "px";
        canvas.style.paddingTop = 0 + "px";
        canvas.style.paddingBottom = 0 + "px";
        canvas.style.display = "block";
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("safari") != -1) {
            if (ua.indexOf("chrome") > -1) {
            }
            else {
            }
        }
        return scale;
    };
    return ScaleManager;
}());
exports.ScaleManager = ScaleManager;
