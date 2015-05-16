Template.promptPlay.events({
    "change [type=range]": function(event) {
        event.preventDefault();

        console.log(event)
    }
});

Template.promptPlay.onRendered(function () {
    var id = this._id;
    var main = this.$('#main').context;
    var scroll = this.$('#scroll-speed')[0];
    var mirror = this.$('#mirror')[0];
    console.log(mirror);
    console.log(scroll);
    var width = main.clientWidth;
    var height = main.clientHeight;

    // TEX
    var fontSize = 128;

// The square letter texture will have 16 * 16 = 256 letters, enough for all 8-bit characters.
    var lettersPerSide = 24;

    var c = document.createElement('canvas');
    //main.appendChild(c);
    c.width = c.height = fontSize*lettersPerSide;
    var ctx = c.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.font = fontSize+'px Monospace';

// This is a magic number for aligning the letters on rows. YMMV.
    var yOffset = -0.25;

// Draw all the letters to the canvas.
    for (var i=0,y=0; y<lettersPerSide; y++) {
        for (var x=0; x<lettersPerSide; x++,i++) {
            var ch = String.fromCharCode(i);
            ctx.fillText(ch, x*fontSize, yOffset*fontSize+(y+1)*fontSize);
        }
    }

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
    console.log(tex);

    //cubeMaterial.depthTest = false;
    var text = new THREE.Mesh(textPlane, cubeMaterial);
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10000);
    camera.position.z = 300;
    camera.lookAt(text.position);
    text.position.y = - textPlaneHeight
    console.log(text.position.y);

    //scene.add(skybox);
    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 300, 200);

    //scene.add(pointLight);
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x010101, 1);
    renderer.shadowMapEnabled = true;
    scene.add(text);
    main.appendChild(renderer.domElement);
    var clock = new THREE.Clock();
    var old_scroll = 0;
    function render(context) {
        requestAnimationFrame(render);
        if (text.position.y > (main.clientHeight - textPlaneHeight)/2) {
            text.position.y = -textPlaneHeight;
            ctx.fillStyle = 'blue';
        }
        if (mirror.checked == true) {
            text.rotation.y = 3.1415;
        } else {
            text.rotation.y = 0;
        }
        if (old_scroll != scroll.value) {
            console.log(scroll.value);
            old_scroll = scroll.value;
        }
        text.position.y += clock.getDelta() * scroll.value;
        renderer.render(scene, camera);

    }
    render(this);
});