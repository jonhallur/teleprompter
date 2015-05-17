
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
    })
});
