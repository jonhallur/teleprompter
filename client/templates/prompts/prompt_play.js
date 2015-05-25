Template.promptPlay.events({
    "change [type=range]": function (event) {
        "use strict";
        event.preventDefault();
    }
});

var BBCodeFontSizeToPixelSize = {
    "1": 40,
    "2": 50,
    "3": 60,
    "4": 70,
    "5": 80,
    "6": 90,
    "7": 100
};

var hexInverseValues = {
    '0': 'f',
    '1': 'e',
    '2': 'd',
    '3': 'c',
    '4': 'b',
    '5': 'a',
    '6': '9',
    '7': '8',
    '8': '7',
    '9': '6',
    'a': '5',
    'b': '4',
    'c': '3',
    'd': '2',
    'e': '1',
    'f': '0'
};

var TextState = function () {
    "use strict";
    this.color = "#ffffff";
    this.size = BBCodeFontSizeToPixelSize["3"];
    this.bold = "";
    this.italic = "";
};

var TokenLine = function (initMaxSize) {
    "use strict";
    this.tokenList = [];
    this.maxFontSize = initMaxSize;
};

function getInverseColorFromHex(hexColor) {
    "use strict";
    var chars = hexColor.split("");
    for (var i = 1; i < hexColor.length; i++) {
        chars[i] = hexInverseValues[chars[i]];
    }
    return chars.join("");
}

function setTextState(ctx, textState) {
    ctx.fillStyle = textState.color;
    ctx.font = textState.bold + textState.italic + textState.size + "px Monospace";
    return ctx;
}

function createReadLine(textPlaneHeight) {
    var rectLength = textPlaneHeight, rectWidth = 2;
    var rectShape = new THREE.Shape();
    rectShape.moveTo(-rectLength, 0);
    rectShape.lineTo(rectLength, 0);
    rectShape.lineTo(rectLength, rectWidth);
    rectShape.lineTo(-rectLength, rectWidth);
    rectShape.lineTo(-rectLength, 0);
    var rectGeom = new THREE.ShapeGeometry(rectShape);
    var rectMesh = new THREE.Mesh(
        rectGeom,
        new THREE.MeshBasicMaterial({color: 0xaa0000, opacity: 0.2}));
    return rectMesh;
}

Template.promptPlay.onDestroyed(function () {
    document.body.style.backgroundColor = "#ffffff";
});

function getTokenList(rawBBCode) {
    var parser = new BBCodeParser(rawBBCode.valueOf());
    var token = parser.getNextToken();
    var tokenList = [];
    while (token !== null) {
        tokenList.push(token);
        token = parser.getNextToken();
    }
    return tokenList;
}
function getRenderLines(tokenList, context, canvas) {
    var textState = new TextState();
    var x = 0;
    var maxWidth = canvas.width;
    var line = new TokenLine(textState.size);
    var lineList = [];
    for(var index = 0; index < tokenList.length; index++) {
        var token = tokenList[index];
        if (token.tokenType === TokenType.TEXT) {
            context = setTextState(context, textState);
            var textWidth = context.measureText(token.textValue).width;
            if ((x + textWidth) > maxWidth) {
                x = 0;
                lineList.push(line);
                line = new TokenLine(textState.size);
            }
            line.tokenList.push(token);
            x = x + textWidth;
        }
        else if (token.tokenType === TokenType.WHITESPACE) {
            if (token.whiteSpaceType === WhiteSpaceType.NEWLINE) {
                x = 0;
                lineList.push(line);
                line = new TokenLine(textState.size)
            }
            else if (token.whiteSpaceType === WhiteSpaceType.SPACE) {
                x = x + context.measureText("0").width;
                line.tokenList.push(token)
            }
        }
        else if (token.tokenType === TokenType.FORMAT) {
            if (token.formatType === FormatType.SIZE) {
                if (token.formatMethod === FormatMethod.START) {
                    if (token.value !== null) {
                        var newSize = BBCodeFontSizeToPixelSize[token.value];
                        if (newSize > line.maxFontSize) {
                            line.maxFontSize = newSize;
                        }
                        textState.size = newSize;
                    }
                }
                else if (token.formatMethod = FormatMethod.END) {
                    var defaultFontSize = "3";
                    textState.size = BBCodeFontSizeToPixelSize[defaultFontSize];
                }
            }
            else if (token.formatType === FormatType.STYLE) {
                if (token.value === FormatStyle.BOLD && token.formatMethod === FormatMethod.START) {
                    textState.bold = "bold ";
                }
                else if (token.value === FormatStyle.BOLD && token.formatMethod === FormatMethod.END) {
                    textState.bold = "";
                }
            }
            line.tokenList.push(token);
        }
    }
    return lineList;

}

Template.promptPlay.onRendered(function () {
    "use strict";
    var rawBBCode = this.data.text;
    //var main = this.$('#main');
    var prompt_canvas = this.$('#prompt-canvas')[0];
    console.log(prompt_canvas);
    var scroll = this.$('#scroll-speed')[0];
    var mirror = this.$('#mirror')[0];
    var width = window.innerWidth * 0.9;
    var height = window.innerHeight * 0.9;
    document.body.style.backgroundColor = "#000000";

    // TEX
// The square letter texture will have 16 * 16 = 256 letters, enough for all 8-bit characters.
    var lettersPerSide = 16;

    var c = document.createElement('canvas');
    //main.appendChild(c);

    c.width = c.height = 1024;
    var ctx = c.getContext('2d');
    ctx.fillStyle = 'white';

    var tokenList = getTokenList(rawBBCode);
    var lines = getRenderLines(tokenList, ctx, c);
    console.log("lines: " + lines.length);

    var x = 0;
    var y = 0;
    var textState = new TextState();
    console.log(lines);
    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        var line = lines[lineIndex];
        y = y + line.maxFontSize;
        x = 0;
        console.log("line: " + lineIndex);
        for (var tokenIndex = 0; tokenIndex < line.tokenList.length; tokenIndex++){
            var token = line.tokenList[tokenIndex];
            if (token.tokenType === TokenType.TEXT) {
                ctx = setTextState(ctx, textState);
                var text_width = ctx.measureText(token.textValue).width;
                if (y > c.height) {
                    break;
                }
                ctx.fillText(token.textValue, x, y);
                x = x + text_width;
            }
            if (token.tokenType === TokenType.WHITESPACE && token.whiteSpaceType === WhiteSpaceType.SPACE) {
                x = x + ctx.measureText("0").width;
            }
            if (token.tokenType === TokenType.FORMAT) {
                if (token.formatType === FormatType.COLOR){
                    if (token.formatMethod === FormatMethod.START) {
                        textState.color = getInverseColorFromHex(token.value);
                    } else if (token.formatMethod === FormatMethod.END) {
                        textState.color = '#ffffff';
                    }
                }
                if (token.formatType === FormatType.STYLE) {
                    if (token.formatMethod == FormatMethod.START) {
                        if (token.value == FormatStyle.BOLD) {
                            textState.bold = "bold ";
                        }
                        if (token.value == FormatStyle.ITALIC) {
                            textState.italic = "italic ";
                        }

                    }
                    else if (token.formatMethod === FormatMethod.END) {
                        if (token.value === FormatStyle.BOLD) {
                            textState.bold = "";
                        }
                        if (token.value === FormatStyle.ITALIC) {
                            textState.italic = "";
                        }

                    }
                }
                if (token.formatType === FormatType.SIZE) {
                    if (token.formatMethod === FormatMethod.START) {
                        textState.size = BBCodeFontSizeToPixelSize[token.value];
                    }
                    else if (token.formatMethod === FormatMethod.END) {
                        textState.size = BBCodeFontSizeToPixelSize["3"];
                    }
                }
            }
        }
    }
    /*
    var x = 0;
    var y = textState.size;

      for (var index=0; index < tokenList.length; index++) {
        var current = tokenList[index];
        if (current.tokenType === TokenType.TEXT) {
            ctx = setTextState(ctx, textState, textState.size);
            var text_width = ctx.measureText(current.textValue).width;
            if ((x + text_width) > c.width) {
                x = 0;
                y = y + textState.size

            }
            if (y > c.height) {
                break;
            }
            ctx.fillText(current.textValue, x, y);
            x = x + text_width;
        }
        if (current.tokenType === TokenType.WHITESPACE) {
            if (current.whiteSpaceType === WhiteSpaceType.NEWLINE) {
                y = y + textState.size;
                x = 0;
            }
            if (current.whiteSpaceType === WhiteSpaceType.SPACE) {
                x = x + ctx.measureText("0").width;
            }
        }
        if (current.tokenType === TokenType.FORMAT) {
            if (current.formatType === FormatType.COLOR){
                if (current.formatMethod === FormatMethod.START) {
                    var inverse = getInverseColorFromHex(current.value);
                    textState.color = inverse;
                } else if (current.formatMethod === FormatMethod.END) {
                    textState.color = '#ffffff';
                }
            }
            if (current.formatType === FormatType.STYLE) {
                if (current.formatMethod == FormatMethod.START) {
                    if (current.value == FormatStyle.BOLD) {
                        textState.bold = "bold ";
                    }
                    if (current.value == FormatStyle.ITALIC) {
                        textState.italic = "italic ";
                    }

                }
                else if (current.formatMethod === FormatMethod.END) {
                    if (current.value === FormatStyle.BOLD) {
                        textState.bold = "";
                    }
                    if (current.value === FormatStyle.ITALIC) {
                        textState.italic = "";
                    }

                }
            }
            if (current.formatType === FormatType.SIZE) {
                if (current.formatMethod === FormatMethod.START) {
                    textState.size = BBCodeFontSizeToPixelSize[current.value];
                }
                else if (current.formatMethod === FormatMethod.END) {
                    textState.size = BBCodeFontSizeToPixelSize["1"];
                }
            }
        }

    }*/


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
    var textPlane = new THREE.PlaneGeometry(textPlaneHeight, textPlaneWidth);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide,
        transparent: true
    } );

    //cubeMaterial.depthTest = false;
    var text = new THREE.Mesh(textPlane, cubeMaterial);
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10000);
    camera.position.z = 200;
    camera.lookAt(text.position);
    text.position.y = - textPlaneHeight/2;
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
    renderer.setClearColor(0x000000, 1);
    renderer.shadowMapEnabled = true;
    scene.add(text);

    var readLineMesh = createReadLine(textPlaneHeight);
    scene.add( readLineMesh );

    //main.appendChild(renderer.domElement);
    var clock = new THREE.Clock();
    var old_scroll = 0;
    function render(context) {
        requestAnimationFrame(render);
        if (text.position.y > textPlaneHeight/2) {
            text.position.y = -textPlaneHeight/2;
        }
        if (text.position.y < -textPlaneHeight/2) {
            text.position.y = textPlaneHeight/2;
        }
        if (mirror.checked == true) {
            text.rotation.y = Math.PI;
        } else {
            text.rotation.y = 0;
        }
        if (old_scroll != scroll.value) {
            old_scroll = scroll.value;
        }
        var shifted_scroll = scroll.value - 50;
        var scroll_threshold = 2;
        if (shifted_scroll < scroll_threshold && shifted_scroll > -scroll_threshold) {
            shifted_scroll = 0;
        }
        text.position.y += clock.getDelta() * shifted_scroll;
        renderer.render(scene, camera);

    }
    render(this);
});