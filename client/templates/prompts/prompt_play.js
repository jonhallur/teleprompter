Template.promptPlay.events({
    "change [type=range]": function (event) {
        "use strict";
        event.preventDefault();
    }
});

Template.promptPlay.onRendered(function () {
    "use strict";
    var rawBBCode = this.data.text;
    //var main = this.$('#main');
    var prompt_canvas = this.$('#prompt-canvas')[0];
    var scroll = this.$('#scroll-speed')[0];
    var mirror = this.$('#mirror')[0];
    var width = main.clientWidth;
    var height = main.clientHeight;

    // TEX
    var fontSize = 84;

// The square letter texture will have 16 * 16 = 256 letters, enough for all 8-bit characters.
    var lettersPerSide = 16;

    var c = document.createElement('canvas');
    //main.appendChild(c);
    c.width = c.height = 1024;
    var ctx = c.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.font = fontSize+'px Monospace';

// This is a magic number for aligning the letters on rows. YMMV.
    var yOffset = -0.25;

// Draw all the letters to the canvas.
    var parser = new BBCodeParser(rawBBCode.valueOf());
    console.log(typeof rawBBCode);
    var token = parser.getNextToken();
    var tokenList = [];
    var lines = [];
    while (token !== null) {
        tokenList.push(token);
        token = parser.getNextToken();
    }
    var x = fontSize;
    var y = fontSize;
    for (var index in tokenList) {
        var current = tokenList[index];
        if (current.tokenType === TokenType.TEXT) {
            var x_forcast = fontSize*current.textValue.length*0.55
            if ((x + x_forcast) > c.width) {
                x = fontSize;
                y = y + fontSize

            }
            ctx.fillText(current.textValue, x, y);
            x = x + x_forcast;
        }
        if (current.tokenType === TokenType.WHITESPACE) {
            if (current.whiteSpaceType === WhiteSpaceType.NEWLINE) {
                console.log("new line");
                y = y + fontSize;
                x = fontSize;
            }
            if (current.whiteSpaceType === WhiteSpaceType.SPACE) {
                x = x + fontSize*0.55;
                console.log("space");
            }
        }

    }


/*    for (var i=0,y=0; y<lettersPerSide; y++) {
        for (var x=0; x<lettersPerSide; x++,i++) {
            var ch = String.fromCharCode(i);
            ctx.fillText(ch, x*fontSize, yOffset*fontSize+(y+1)*fontSize);
        }
    }*/

// Create a texture from the letter canvas.
    var tex = new THREE.Texture(c);
// Tell Three.js not to flip the texture.
    tex.flipY = true;
// And tell Three.js that it needs to update the texture.
    tex.needsUpdate = true;
    var textPlaneHeight = 256;
    var textPlaneWidth = 256;
    var scene = new THREE.Scene();
    var cubeTexture = THREE.ImageUtils.loadTexture('./sky.jpg');
    var textPlane = new THREE.PlaneGeometry(textPlaneHeight, textPlaneWidth);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide,
        transparent: true
    } );

    //cubeMaterial.depthTest = false;
    var text = new THREE.Mesh(textPlane, cubeMaterial);
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10000);
    camera.position.z = 300;
    camera.lookAt(text.position);
    text.position.y = - textPlaneHeight
    //scene.add(skybox);
    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 300, 200);

    //scene.add(pointLight);
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: prompt_canvas
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x010101, 1);
    renderer.shadowMapEnabled = true;
    scene.add(text);
    //main.appendChild(renderer.domElement);
    var clock = new THREE.Clock();
    var old_scroll = 0;
    function render(context) {
        requestAnimationFrame(render);
        if (text.position.y > (main.clientHeight - textPlaneHeight)/2) {
            text.position.y = -textPlaneHeight;
            ctx.fillStyle = 'blue';
        }
        if (mirror.checked == true) {
            text.rotation.y = Math.PI;
        } else {
            text.rotation.y = 0;
        }
        if (old_scroll != scroll.value) {
            old_scroll = scroll.value;
        }
        text.position.y += clock.getDelta() * scroll.value;
        renderer.render(scene, camera);

    }
    render(this);
});