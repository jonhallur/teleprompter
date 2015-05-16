var BBCodeParser = function (text) {
	this.parserLocation = 0;
	this.text = text;
	this.getNextWord = function () {
		var start = this.parserLocation;
		var location = start;
		for (; location < text.length; location++) {
			if (text[location] === " ") {
				break;
			}
		}
		this.parserLocation = location+1;
		return this.text.slice(start, location)
	}
};
