
describe("BBCode parser", function(){
    it("Can create object", function() {
       var parser = new BBCodeParser("");
       expect(parser).toBeDefined();
    });

    it("Stores all the text", function() {
        var text = "foo";
        expect(new BBCodeParser(text).text).toBe(text);
    });

    it("Should return one word", function() {
        var first = "boo";
        var text = first + " foo";
        var firstToken = new BBCodeParser(text).getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.TEXT);
        expect(firstToken.textValue).toBe(first);
    });

    it("Should return text and space", function() {
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
        var text = "[left]";
        var parser = new BBCodeParser(text);
        var firstToken = parser.getNextToken();
        expect(firstToken.tokenType).toBe(TokenType.FORMAT);
        expect(firstToken.formatMethod).toBe(FormatMethod.START);
        expect(firstToken.value).toBe(FormatAligment.LEFT);
    });

});
