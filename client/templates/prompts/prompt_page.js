Template.promptPage.helpers({
    fixedDate: function () {
        return this.submitted.toLocaleDateString();
    }
});

Template.promptPage.events({
    'click .edit-prompt': function(event) {
        event.preventDefault();
        Router.go('promptEdit', {_id: this._id});
    },
    'click .play-prompt': function(event) {
        event.preventDefault();
        Router.go('promptPlay', {_id: this._id});
    }
});