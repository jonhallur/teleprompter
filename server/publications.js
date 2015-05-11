Meteor.publish('prompts', function () {
    return Prompts.find();
});