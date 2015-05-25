var TokenType = {
    TEXT: "text",
    WHITESPACE: "whitespace",
    FORMAT: "format"
};

var WhiteSpaceType = {
    SPACE: 32,
    NEWLINE: 10
};

var FormatTag = {
    OPEN: '[',
    CLOSE: ']',
    END: '/'
};

var FormatMethod = {
    START: "start",
    END: "end"
};

var FormatType = {
    STYLE: "style",
    ALIGNMENT: "alignment",
    SIZE: "size",
    COLOR: "color",
    FONT: "font"
};

var FormatStyle = {
    BOLD: "b",
    ITALIC: "i",
    UNDERLINE: "u"
};

var FormatAligment = {
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right",
    JUSTIFY: "justify"
};

var styleRegex = /\[\/?[b|i|u]\]/;
var alignRegex = /\[\/?(left|center|right|justify)\]/;
var colorOpenRegex = /\[color=#[0-9a-f]{6}\]/;
var colorCloseRegex = /\[\/color\]/;
var sizeOpenRegex = /\[size=[1-7]\]/;
var sizeCloseRegex = /\[\/size\]/;
var fontOpenRegex = /\[font=[a-zA-z ,.]{1,50}\]/;
var fontCloseRegex = /\[\/font\]/;

var styleList = [FormatStyle.BOLD, FormatStyle.ITALIC, FormatStyle.UNDERLINE];
var alignmentList = [FormatAligment.LEFT, FormatAligment.CENTER, FormatAligment.RIGHT, FormatAligment.JUSTIFY];

function Token(type) {
    "use strict";
    this.tokenType = type;
}

function TextToken(text) {
    "use strict";
    Token.call(this, TokenType.TEXT);
    this.textValue = text;
}

function WhiteSpaceToken(whiteSpaceType) {
    "use strict";
    Token.call(this, TokenType.WHITESPACE);
    this.whiteSpaceType = whiteSpaceType;
}

function FormatToken(formatMethod, formatType, value) {
    "use strict";
    Token.call(this, TokenType.FORMAT);
    this.formatMethod = formatMethod;
    this.formatType = formatType;
    this.value = value;
}

TextToken.prototype = Object.create(Token.prototype);
WhiteSpaceToken.prototype = Object.create(Token.prototype);
FormatToken.prototype = Object.create(Token.prototype);

var BBCodeParser = function (text) {
    "use strict";
    this.parserLocation = 0;
    this.text = text;
};

BBCodeParser.prototype.getNextToken = function () {
    "use strict";
    if (this.parserLocation >= this.text.length) {
        return null;
    }
    var start = this.parserLocation, location = start, c = this.text[location], formatToken = null;
    if (c.charCodeAt() < 33) {
    }
    if (c.charCodeAt() === WhiteSpaceType.NEWLINE) {
        this.parserLocation++;
        return new WhiteSpaceToken(WhiteSpaceType.NEWLINE);
    }
    if (c.charCodeAt() === WhiteSpaceType.SPACE) {
        this.parserLocation++;
        return new WhiteSpaceToken(WhiteSpaceType.SPACE);
    }
    this._parseStyleFormat = function () {
        var formatMethod = FormatMethod.START,
            formatLength = 3,
            styleCharLocation = start + 1;
        if (styleCharLocation === this.text.length) {
            return null;
        }
        if (this.text[styleCharLocation] === FormatTag.END) {
            if (styleCharLocation + 1 === this.text.length) {
                return null;
            }
            styleCharLocation++;
            formatLength++;
            formatMethod = FormatMethod.END;

        }
        if (styleList.indexOf(this.text[styleCharLocation]) !== -1) {
            if (styleCharLocation + 1 === this.text.length) {
                return null;
            }
            if (this.text[(styleCharLocation + 1)] === FormatTag.CLOSE) {
                this.parserLocation = this.parserLocation + formatLength;
                return new FormatToken(formatMethod, FormatType.STYLE, this.text[styleCharLocation]);
            }
        }
        return null;
    };

    this._parseAlignmentFormat = function () {
        var formatMethod = FormatMethod.START,
            formatLengthModifier = 2,
            alignCharLocation = start + 1;
        if (alignCharLocation === this.text.length) {
            return null;
        }
        if (this.text[alignCharLocation] === FormatTag.END) {
            if (alignCharLocation + 1 === this.text.length) {
                return null;
            }
            alignCharLocation++;
            formatLengthModifier += 1;
            formatMethod = FormatMethod.END;
        }
        for (var index in alignmentList) {
            var tagLength = alignmentList[index].length;
            if (this.text.length < alignCharLocation + tagLength) {
                return null;
            } else if (this.text.slice(alignCharLocation, alignCharLocation + tagLength) === alignmentList[index]){
                this.parserLocation += tagLength + formatLengthModifier;
                return new FormatToken(formatMethod, FormatType.ALIGNMENT, alignmentList[index]);
            }

        }
        return null;
    };

    this._parseColorAndSizeFormat = function () {
        var tagStartLocation = start + 1,
            colorValueLocation = 7,
            sizeValueLocation = 6;
        if (tagStartLocation === this.text.length) {
            return null;
        }
        var maxTagLength = 15;
        var testString = this.text.slice(this.parserLocation, this.parserLocation + maxTagLength);
        if (colorOpenRegex.test(testString)) {
            this.parserLocation += 15;
            return new FormatToken(
                FormatMethod.START,
                FormatType.COLOR,
                testString.slice(colorValueLocation, colorValueLocation + 7));
        }
        testString = this.text.slice(this.parserLocation, this.parserLocation + 8);
        if (colorCloseRegex.test(testString)) {
            this.parserLocation += 8;
            return new FormatToken(
                FormatMethod.END,
                FormatType.COLOR,
                null
            );
        }
        testString = this.text.slice(this.parserLocation, this.parserLocation + 8);
        if (sizeOpenRegex.test(testString)) {
            this.parserLocation += 8;
            return new FormatToken(
                FormatMethod.START,
                FormatType.SIZE,
                testString.slice(sizeValueLocation, sizeValueLocation+1)
            )
        }
        testString = this.text.slice(this.parserLocation, this.parserLocation + 7);
        if (sizeCloseRegex.test(testString)) {
            this.parserLocation += 7;
            return new FormatToken(
                FormatMethod.END,
                FormatType.SIZE,
                null
            )
        }
        return null;
    };

    this._parseFontFormat = function () {
        var maxTagLength = 50;
        var searchString = this.text.slice(this.parserLocation, this.parserLocation + maxTagLength)
        if (fontOpenRegex.test(searchString)) {
            var index = searchString.indexOf(FormatTag.CLOSE);
            if (index !== -1) {
                this.parserLocation += index+1;
                return new FormatToken(
                    FormatMethod.START,
                    FormatType.FONT
                )
            }
        }
        else if (fontCloseRegex.test(searchString)) {
            var index = searchString.indexOf(FormatTag.CLOSE);
            if (index !== -1) {
                this.parserLocation += index+1;
                return new FormatToken(
                    FormatMethod.END,
                    FormatType.FONT
                )
            }
        }
        return null;
    };

    if (c === FormatTag.OPEN) {
        formatToken = this._parseStyleFormat();
        if (formatToken !== null) {
            return formatToken;
        }
        formatToken = this._parseAlignmentFormat();
        if (formatToken !== null) {
            return formatToken;
        }
        formatToken = this._parseColorAndSizeFormat();
        if (formatToken !== null) {
            return formatToken;
        }
        formatToken = this._parseFontFormat();
        if (formatToken !== null) {
            return formatToken;
        }
    }

    for (location; this.text.length > location; location++) {
        if (this.text[location] === " " || this.text[location] === "\n") {
            this.parserLocation = location;
            return new TextToken(this.text.slice(start, location));
        } else if (this.text[location] === FormatTag.OPEN) {
            var testText = this.text.slice(location, location + 15);
            if (
                    styleRegex.test(testText) ||
                    alignRegex.test(testText) ||
                    colorOpenRegex.test(testText) ||
                    colorCloseRegex.test(testText) ||
                    sizeOpenRegex.test(testText) ||
                    sizeCloseRegex.test(testText) ||
                    fontCloseRegex.test(testText)
            ) {
                this.parserLocation = location;
                return new TextToken(this.text.slice(start, location));
            }
        }
        if (location + 1 === this.text.length) {
            this.parserLocation = location + 1;
            return new TextToken(this.text.slice(start, location + 1));
        }
    }
};

