/**
 * Created by jonhallur on 26.4.2015.
 */
if (Prompts.find().count() === 0) {
    Prompts.insert({
        title: 'Some prompt',
        text: 'Some text and stuff',
        submitted: new Date(),
        submittedBy: '2l3k4jh5l23k4jh5l23kj45h'
    });

    Prompts.insert({
        title: 'Another prompt',
        text: 'Some text and stuff with \n formatting \n and stuff',
        submitted: new Date(),
        submittedBy: '234jkh5g2kj34h5g23kj4hg52j3k4h5gk2j34g5'
    });
}