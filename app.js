var renderer = null;
var scene = null;

function mainLoop () {
    requestAnimationFrame(mainLoop);
    
};

function init () {
    renderer = new PIXI.WebGLRenderer(640, 480);
    scene = new PIXI.Container();
    document.body.appendChild(renderer.view);
    requestAnimationFrame(mainLoop);
};

window.onload = function () {
    init();
};