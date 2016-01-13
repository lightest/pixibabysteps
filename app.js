var renderer = null;
var scene = null;
var rect = null;

function mainLoop () {
    requestAnimationFrame(mainLoop);
    renderer.render(scene);
};

function init () {
    renderer = new PIXI.WebGLRenderer(640, 480);
    scene = new PIXI.Container();
    document.body.appendChild(renderer.view);
    rect = new PIXI.Graphics();
    rect.lineStyle(4, 0xFF3300, 1);
    rect.beginFill(0x66CCFF);
    rect.drawRect(0, 0, 64, 64);
    rect.endFill();
    rect.x = 170;
    rect.y = 170;
    scene.addChild(rect);

    requestAnimationFrame(mainLoop);
};

window.onload = function () {
    init();
};