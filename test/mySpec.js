
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
        expect(new BBCodeParser(text).getNextWord()).toBe(first);
    });

    it("Should return two words", function() {
        var first = "boo";
        var second = "foo";
        var text = first + " " + second;
        var parser = new BBCodeParser(text);
        expect(parser.getNextWord()).toBe(first);
        expect(parser.getNextWord()).toBe(second);
    })
});
