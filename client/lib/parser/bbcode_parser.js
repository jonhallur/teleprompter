var TokenType = {
    TEXT: "text",
    WHITESPACE: "whitespace",
    FORMAT: "format"
};

var WhiteSpaceType = {
    SPACE: '\ ',
    NEWLINE: '\n'
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
    COLOR: "color"
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
    this.hasNext = true;
};

BBCodeParser.prototype.getNextToken = function () {
    "use strict";
    if (!this.hasNext) {
        return null;
    }
    var start = this.parserLocation, location = start, c = this.text[location], formatToken = null;
    if (c === WhiteSpaceType.NEWLINE || c === WhiteSpaceType.SPACE) {
        this.parserLocation++;
        return new WhiteSpaceToken(c);
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
            formatLengthModifier = 1,
            styleCharLocation = start + 1;
        if (styleCharLocation === this.text.length) {
            return null;
        }
        if (this.text[styleCharLocation] === FormatTag.END) {
            if (styleCharLocation + 1 === this.text.length) {
                return null;
            }
            styleCharLocation++;
            formatLengthModifier++;
            formatMethod = FormatMethod.END;
        }
        for (var index in alignmentList) {
            var tagLength = alignmentList[index].length;
            if (this.text.length < styleCharLocation + tagLength) {
                return null;
            } else if (this.text.slice(styleCharLocation, styleCharLocation + tagLength) === alignmentList[index]){
                return new FormatToken(FormatMethod.START, FormatType.ALIGNMENT, alignmentList[index]);
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
    }

    for (location; this.text.length > location; location++) {
        if (this.text[location] === " ") {
            this.parserLocation = location;
            return new TextToken(this.text.slice(start, location));
        }
        if (location === this.text.length - 1) {
            this.parserLocation = location;
            this.hasNext = false;
            return new TextToken(this.text.slice(start, location + 1));
        }
    }
};