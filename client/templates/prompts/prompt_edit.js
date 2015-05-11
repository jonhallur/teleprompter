/**
 * Created by jonhallur on 30.4.2015.
 */
Template.promptEdit.helpers({
    fixedDate: function () {
        return this.submitted.toLocaleDateString();
    }
});

Template.promptEdit.events({
    'click .save-prompt': function(event, template) {
        event.preventDefault();

        var currentPromptId = this._id;

        var promptProperties = {
            text: template.find('[name=prompt-text]').value
        };
        Prompts.update(currentPromptId, {$set: promptProperties}, function(error) {
            if (error) {
                // display the error to the user
                alert(error.reason);
            } else {
                Router.go('promptPage', {_id: currentPromptId});
            }
        });
    },
    'click .exit-edit': function(event, template) {
        event.preventDefault();
        Router.go('promptPage', {_id: this._id});
    },
    'keyup #prompt-text': _.throttle(function(event) {
        console.log("stuff");
    }, 300)
});
