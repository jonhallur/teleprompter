Template.promptPage.helpers({
    fixedDate: function () {
        return this.submitted.toLocaleDateString();
    }
});

Template.promptPage.onDestroyed(function () {
    $("textarea").sceditor("instance").destroy();
});

Template.promptPage.rendered = function() {
    $(function() {
        $("textarea").sceditor({
            plugins: "bbcode",
            style: "minified/jquery.sceditor.default.min.css",
            toolbar: "",
            readOnly: true
        });
    });

};

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