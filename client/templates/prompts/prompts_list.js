Template.promptsList.helpers({
    prompts: function () {
        return Prompts.find({}, {sort: {submitted: -1}});
    }
});

Template.promptsList.events({
    'submit .prompt-new': function(event) {
        event.preventDefault();

        var $input = $(event.target).find('[type=text]');
        if (! $input.val())
            return;

        Prompts.insert({
            title: $input.val(),
            text: '',
            submitted: new Date(),
            submittedBy: Meteor.userId()
        });
        $input.val('');
    }
});