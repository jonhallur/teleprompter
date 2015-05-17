TokenType = {
	TEXT: 0,
	WHITESPACE: 1,
	FORMAT: 2
};

WhiteSpaceType = {
	SPACE: '\ ',
	NEWLINE: '\n'
};

FormatTag = {
	OPEN: '[',
	CLOSE: ']'
};

FormatMethod = {
	START: 0,
	END: 1
};

FormatType = {
	STYLE: 0,
	ALIGNMENT: 1,
	SIZE: 2,
	COLOR: 3
};

FormatStyle = {
	BOLD: "b",
	ITALIC: "i",
	UNDERLINE: "u"
};

FormatAligment = {
	LEFT: "left",
	CENTER: "center",
	RIGHT: "right",
	JUSTIFY: "justify"
};

function Token(type) {
	this.tokenType = type;
}

function TextToken(text) {
	Token.call(this, TokenType.TEXT);
	this.textValue = text;
}

function WhiteSpaceToken(whiteSpaceType) {
	Token.call(this, TokenType.WHITESPACE);
	this.whiteSpaceType = whiteSpaceType;
}

function FormatToken(formatMethod, formatType, value) {
	Token.call(this, TokenType.FORMAT);
	this.formatMethod = formatMethod;
	this.formatType = formatType;
	if(formatType == FormatType.SIZE || formatType == formatType.COLOR) {
		this.value = value;
	}
}

TextToken.prototype = Object.create(Token.prototype);
WhiteSpaceToken.prototype = Object.create(Token.prototype);
FormatToken.prototype = Object.create(Token.prototype);


BBCodeParser = function (text) {
	this.parserLocation = 0;
	this.text = text;
};

BBCodeParser.prototype.getNextToken = function () {
	var start = this.parserLocation;
	var location = start;
	var c = this.text[location];
	if(c == WhiteSpaceType.NEWLINE || c == WhiteSpaceType.SPACE) {
		this.parserLocation++;
		return new WhiteSpaceToken(c);
	}
	if(c == FormatTag.OPEN) {
		var next = this.text[location+1];
		if (next == FormatStyle.BOLD || next == FormatStyle.ITALIC || next == FormatStyle.UNDERLINE) {
			if (this.text[location+2] == FormatTag.CLOSE) {
				this.parserLocation += 3;
				return new FormatType(FormatMethod.START)
			}
		}
	}
	for (; location < this.text.length; location++) {
		if (this.text[location] === " ") {
			this.parserLocation = location;
			word = this.text.slice(start, location)
			return new TextToken(word);
		}
	}
};

/*
BBCodeParser.prototype.getNextWord = function () {
	var start = this.parserLocation;
	var location = start;
	for (; location < this.text.length; location++) {
		if (this.text[location] === " ") {
			break;
		}
	}
	this.parserLocation = location+1;
	return this.text.slice(start, location)
};
*/
