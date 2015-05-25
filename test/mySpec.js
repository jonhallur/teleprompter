
describe("BBCode parser", function(){
    "use strict";
    it("Can create object", function() {
       var parser = new BBCodeParser("");
       expect(parser).toBeDefined();
    });

    it("Stores all the text", function() {
        "use strict";
        var text = "foo";
        expect(new BBCodeParser(text).text).toBe(text);
    });

    it("Should return one word", function() {
        "use strict";
        var first = "boo";
        var text = first + " foo";
        var firstToken = new BBCodeParser(text).getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.TEXT);
        expect(firstToken.textValue).toBe(first);
    });

    it("Should return text and space", function() {
        "use strict";
            var first = "boo";
            var second = " ";
            var text = first + second;
            var parser = new BBCodeParser(text);
            var firstToken = parser.getNextToken();
            var secondToken = parser.getNextToken();
            expect(firstToken.tokenType).toBe(TokenType.TEXT);
            expect(firstToken.textValue).toBe("boo");
            expect(secondToken.tokenType).toBe(TokenType.WHITESPACE);
    });

    it("should return text space text", function() {
        "use strict";
        var text = "text space";
        var parser = new BBCodeParser(text);
        var firstToken = parser.getNextToken();
        var secondToken = parser.getNextToken();
        var thirdToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.TEXT);
        expect(firstToken.textValue).toBe("text");
        expect(secondToken.tokenType).toBe(TokenType.WHITESPACE);
        expect(thirdToken.tokenType).toBe(TokenType.TEXT);
        expect(thirdToken.textValue).toBe("space");
    });

    it("should ignore an ending format tag", function() {
        "use strict";
        var text = "[";
        var parser = new BBCodeParser(text);
        var firstToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.TEXT);
        expect(firstToken.textValue).toBe(text);
    });

    it("should ignore and unfinished short style tag", function() {
        "use strict";
        var text = "[b";
        var parser = new BBCodeParser(text);
        var firstToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.TEXT);
        expect(firstToken.textValue).toBe(text);
    });

    it("should return a valid [b] token", function () {
        "use strict";
        var text = "[b]";
        var parser = new BBCodeParser(text);
        var firstToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.FORMAT);
        expect(firstToken.formatMethod).toBe(FormatMethod.START);
        expect(firstToken.value).toBe(FormatStyle.BOLD);
        expect(firstToken.formatType).toBe(FormatType.STYLE);
    });

    it("should return text on wrongly formatted bold tag", function () {
        "use strict";
        var text = "[bold]";
        var parser = new BBCodeParser(text);
        var firstToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.TEXT);
    });

    it("should return a valid [/b] token", function () {
        "use strict";
        var text = "[/b]";
        var parser = new BBCodeParser(text);
        var firstToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.FORMAT);
        expect(firstToken.formatMethod).toBe(FormatMethod.END);
        expect(firstToken.value).toBe(FormatStyle.BOLD);
    });

    it("should return a close format tag next to text next to space", function () {
        "use strict";
        var text = "[/b]space ";
        var parser = new BBCodeParser(text);
        var firstToken = parser.getNextToken();
        var secondToken = parser.getNextToken();
        var thirdToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.FORMAT);
        expect(firstToken.formatMethod).toBe(FormatMethod.END);
        expect(firstToken.value).toBe("b");
        expect(secondToken.tokenType).toBe(TokenType.TEXT);
        expect(secondToken.textValue).toBe("space");
        expect(thirdToken.tokenType).toBe(TokenType.WHITESPACE);
    });

    it("should return a valid [left] token", function () {
        "use strict";
        var text = "[left]text[/left]\n";
        var parser = new BBCodeParser(text);
        var firstToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.FORMAT);
        expect(firstToken.formatMethod).toBe(FormatMethod.START);
        expect(firstToken.value).toBe(FormatAligment.LEFT);
        expect(firstToken.formatType).toBe(FormatType.ALIGNMENT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.FORMAT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);


    });

    it("should return null on finish", function () {
        var parser = new BBCodeParser("a");
        var firstToken = parser.getNextToken();
        var secondToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.TEXT);
        expect(secondToken).toBeNull();
    });

    it("should recognize a whole [color=#??????] tag", function () {
        var colorTag = "[color=#123456]";
        var parser = new BBCodeParser(colorTag);
        var firstToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.FORMAT);
        expect(firstToken.formatMethod).toBe(FormatMethod.START);
        expect(firstToken.formatType).toBe(FormatType.COLOR);
        expect(firstToken.value).toBe("#123456");
    });

    it("should recognize a whole [/color] tag", function () {
        var colorTag = "[/color]";
        var parser = new BBCodeParser(colorTag);
        var firstToken = parser.getNextToken();
        var secondToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.FORMAT);
        expect(firstToken.formatMethod).toBe(FormatMethod.END);
        expect(firstToken.formatType).toBe(FormatType.COLOR);
        expect(firstToken.value).toBeNull();
        expect(secondToken).toBeNull();
    });

    it("should recognize a [size=7] tag", function () {
        var text = "[size=7]";
        var parser = new BBCodeParser(text);
        var firstToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.FORMAT);
        expect(firstToken.value).toBe("7");
        expect(parser.getNextToken()).toBeNull();
    });

    if("should recognize a valid size open close tag", function () {
            var text = "[size=5]text[/size]";
            var parser = new BBCodeParser(text);
            var first = parser.getNextToken();
            var second = parser.getNextToken();
            var third = parser.getNextToken();
            expect(first.tokenType).toBe(TokenType.FORMAT);
            expect(first.formatType).toBe(FormatType.SIZE);
            expect(first.value).toBe("5");
            expect(first.formatMethod).toBe(FormatMethod.START);
            expect(second.tokenType).toBe(TokenType.TEXT);
            expect(second.textValue).toBe("text");
            expect(third.tokenType).toBe(TokenType.FORMAT);
            expect(third.formatType).toBe(FormatType.SIZE);
            expect(third.formatMethod).toBe(FormatMethod.END);
            expect(third.value).toBeNull();
        })

    it("Should recognize a long string of valid data", function () {
        var text = "This is a [b]valid[/b] string of [size=5]words[/size] \n";
        var parser = new BBCodeParser(text);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT); // This
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.FORMAT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.FORMAT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.FORMAT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.FORMAT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().whiteSpaceType).toBe(WhiteSpaceType.NEWLINE);
        expect(parser.getNextToken()).toBeNull();

    });

    it("Should find a new line", function () {
        var text = String.fromCharCode(10,10);
        var parser = new BBCodeParser(text);
        expect(parser.getNextToken().whiteSpaceType).toBe(WhiteSpaceType.NEWLINE);
        expect(parser.getNextToken().whiteSpaceType).toBe(WhiteSpaceType.NEWLINE);

    });

    it("should detect open and close color tags", function () {
        var text = "this [color=#123456]text[/color] is colored";
        var parser = new BBCodeParser(text);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.FORMAT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.FORMAT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
    });

    it("Should not fail on font tag", function () {
        var text = "[center][left][color=#cc00cc][size=7][font=Arial, Helvetica, sans]Lorem ipsum dolor sit amet, consectetur adipiscing elit.[/font][/size][/color][/left]";
        var parser = new BBCodeParser(text);
        expect(parser.getNextToken().value).toBe("center");
        expect(parser.getNextToken().value).toBe("left");
        expect(parser.getNextToken().tokenType).toBe(TokenType.FORMAT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.FORMAT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.FORMAT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().tokenType).toBe(TokenType.TEXT);
        expect(parser.getNextToken().tokenType).toBe(TokenType.WHITESPACE);
        expect(parser.getNextToken().textValue).toBe("elit.");
        expect(parser.getNextToken().formatType).toBe(FormatType.FONT);
        expect(parser.getNextToken().formatType).toBe(FormatType.SIZE);
        expect(parser.getNextToken().formatType).toBe(FormatType.COLOR);
        expect(parser.getNextToken().formatType).toBe(FormatType.ALIGNMENT);
    })
});
