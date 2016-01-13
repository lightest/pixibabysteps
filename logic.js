var world = {
    w: 640,
    h: 480,
    cnv: null,
    ctx: null,
    horizAspect: 480.0 / 640.0,
    init: function () {
        this.cnv = document.querySelector('canvas');
        this.cnv.width = this.w;
        this.cnv.height = this.h;
        this.ctx = this.cnv.getContext('webgl') || this.cnv.getContext('experimental-webgl');

        if(!this.ctx) {
            return null;
        }

        this.ctx.clearColor(0.0, 0.0, 0.0, 1.0);
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.depthFunc(this.ctx.LEQUAL);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);

        return true;
    }
};

var gl = {
    mvMatrix: null,
    shaderProgram: null,
    perspectiveMatrix: null,
    squareVerticesBuffer: null,
    vertexPositionAttribute: null,

    getShader: function (ctx, id) {
        var shaderScript;
        var shader;

        shaderScript = document.querySelector('#' + id);
        if (shaderScript == null) { return null; }

        if (shaderScript.type == 'x-shader/x-vertex') {
            shader = ctx.createShader(ctx.VERTEX_SHADER);
        } else if (shaderScript.type == 'x-shader/x-fragment') {
            shader = ctx.createShader(ctx.FRAGMENT_SHADER);
        }

        ctx.shaderSource(shader, shaderScript.textContent);
        ctx.compileShader(shader);

        if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
            console.log('ERR: something went wrong on shader compilation stage:', ctx.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    },

    initShaders: function (ctx) {
        var fragmentShader = this.getShader(ctx, 'shader-fs');
        var vertexShader = this.getShader(ctx, 'shader-vs');

        this.shaderProgram = ctx.createProgram();
        ctx.attachShader(this.shaderProgram, vertexShader);
        ctx.attachShader(this.shaderProgram, fragmentShader);
        ctx.linkProgram(this.shaderProgram);

        if(!ctx.getProgramParameter(this.shaderProgram, ctx.LINK_STATUS)) {
            console.log('something went wrong while creating shaderProgram');
            return;
        }

        ctx.useProgram(this.shaderProgram);

        this.vertexPositionAttribute = ctx.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        ctx.enableVertexAttribArray(this.vertexPositionAttribute);
    },

    initBuffers: function (ctx) {
        this.squareVerticesBuffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.squareVerticesBuffer);

        var vertices = [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];

        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(vertices), ctx.STATIC_DRAW);
    },

    loadIdentity: function () {
        mvMatrix = Matrix.I(4);
    },

    multiMatrix: function (m) {
        mvMatrix = mvMatrix.x(m);
    },

    mvTranslate: function (v) {
        this.multiMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
    },

    setMatrixUniforms: function (ctx) {
      var pUniform = ctx.getUniformLocation(this.shaderProgram, "uPMatrix");
      ctx.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

      var mvUniform = ctx.getUniformLocation(this.shaderProgram, "uMVMatrix");
      ctx.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
    }
};

function render (ctx) {
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
    gl.perspectiveMatrix = makePerspective(45, world.cnv.width/world.cnv.height, 0.1, 100.0);

    gl.loadIdentity();
    gl.mvTranslate([-0.0, 0.0, -6.0]);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, gl.squareVerticesBuffer);
    ctx.vertexAttribPointer(gl.vertexPositionAttribute, 3, ctx.FLOAT, false, 0, 0);

    gl.setMatrixUniforms(ctx);
    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
};

function init () {};

window.onload = function () {
    if(world.init() == null) { return; }
    gl.initShaders(world.ctx);
    gl.initBuffers(world.ctx);
    setInterval(function () {
        render(world.ctx);
    }, 15);
};