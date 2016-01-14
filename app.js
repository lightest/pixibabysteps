var renderer = null;
var scene = null;
var rect = null;
var rectVX = 10;
var rectVY = 10;

var keyboard = {
    KEYS: {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
    },
    pressed: []
};

function bindKeys () {
    window.addEventListener('keydown', function (e) {
        keyboard.pressed[e.which] = true;
    });

    window.addEventListener('keyup', function (e) {
        keyboard.pressed[e.which] = false;
    });
};

function update () {
    if(keyboard.pressed[keyboard.KEYS.LEFT]) {
        rect.x -= rectVX;
    }
    if(keyboard.pressed[keyboard.KEYS.RIGHT]) {
        rect.x += rectVX;
    }
    if(keyboard.pressed[keyboard.KEYS.UP]) {
        rect.y -= rectVY;
    }
    if(keyboard.pressed[keyboard.KEYS.DOWN]) {
        rect.y += rectVY;
    }
};

function mainLoop () {
    requestAnimationFrame(mainLoop);
    update();
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
    bindKeys();
    requestAnimationFrame(mainLoop);
};

window.onload = function () {
    init();
};